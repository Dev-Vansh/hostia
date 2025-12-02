import express from 'express';
import multer from 'multer';
import path from 'path';
import { db } from '../database.js';
import { authenticateUser, isAdmin } from '../middleware/auth.js';
import { generatePaymentQR } from '../utils/qrcode.js';
import { sendOrderNotification, sendOrderUpdateNotification } from '../utils/discord.js';

const router = express.Router();

// Multer setup for payment screenshots
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'server/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `payment-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed'));
    }
});

// Create Order
router.post('/', authenticateUser, (req, res) => {
    const { planId, promoCode, items } = req.body;
    const userId = req.user.id;

    console.log('Create Order Body:', req.body);

    // Determine plan IDs to fetch
    let planIds = [];
    if (items && Array.isArray(items) && items.length > 0) {
        planIds = items;
    } else if (planId) {
        planIds = [planId];
    } else {
        return res.status(400).json({ error: 'No items or plan provided' });
    }

    // Fetch all plans
    const placeholders = planIds.map(() => '?').join(',');
    db.all(`SELECT * FROM plans WHERE id IN (${placeholders})`, planIds, (err, plans) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (plans.length === 0) {
            return res.status(404).json({ error: 'Plans not found' });
        }

        // Calculate totals
        let originalPrice = 0;
        plans.forEach(plan => {
            // If planIds has duplicates (e.g. 2x same plan), we need to account for that.
            // db.all returns unique rows if IDs are unique, but if we passed [1, 1], SQL `IN` just matches 1.
            // We need to map back to the requested quantity.
            const count = planIds.filter(id => id == plan.id).length;
            originalPrice += plan.price * count;
        });

        let finalPrice = originalPrice;
        let discountAmount = 0;

        // Prepare items JSON for storage
        // We want to store details of what was bought at that time
        const orderItems = planIds.map(id => {
            const plan = plans.find(p => p.id === id);
            return plan ? { id: plan.id, name: plan.name, price: plan.price, type: plan.type } : null;
        }).filter(Boolean);

        const createOrder = () => {
            // We'll use the first planId as the main 'planId' for backward compatibility
            // or we could make it nullable. For now, let's use the first one.
            const mainPlanId = planIds[0];
            const itemsJson = JSON.stringify(orderItems);

            db.run(
                'INSERT INTO orders (userId, planId, originalPrice, discountAmount, finalPrice, promoCode, items) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [userId, mainPlanId, originalPrice, discountAmount, finalPrice, promoCode, itemsJson],
                function (err) {
                    if (err) {
                        // If error is about missing column 'items', we might need to migrate.
                        // But for now let's assume it works or we fix DB.
                        console.error('Order Creation Error:', err);
                        return res.status(500).json({ error: 'Failed to create order: ' + err.message });
                    }
                    res.status(201).json({
                        message: 'Order created successfully',
                        orderId: this.lastID,
                        amount: finalPrice
                    });
                }
            );
        };

        if (promoCode) {
            db.get('SELECT * FROM promos WHERE code = ? AND isActive = 1', [promoCode], (err, promo) => {
                if (promo) {
                    if (promo.expiryDate && new Date(promo.expiryDate) < new Date()) {
                        // Expired
                    } else if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
                        // Limit reached
                    } else {
                        if (promo.type === 'percentage') {
                            discountAmount = (originalPrice * promo.value) / 100;
                        } else {
                            discountAmount = promo.value;
                        }
                        finalPrice = Math.max(0, originalPrice - discountAmount);

                        db.run('UPDATE promos SET usedCount = usedCount + 1 WHERE id = ?', [promo.id]);
                    }
                }
                createOrder();
            });
        } else {
            createOrder();
        }
    });
});

// Get QR Code for Order
router.get('/:id/qr', authenticateUser, (req, res) => {
    db.get('SELECT * FROM orders WHERE id = ? AND userId = ?', [req.params.id, req.user.id], async (err, order) => {
        if (err || !order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        try {
            const qrCode = await generatePaymentQR(order.finalPrice, process.env.UPI_ID);
            res.json({ qrCode, amount: order.finalPrice });
        } catch (error) {
            res.status(500).json({ error: 'Failed to generate QR code' });
        }
    });
});

// Get Single Order
router.get('/:id', authenticateUser, (req, res) => {
    db.get(
        `SELECT o.*, p.name as planName, p.type as planType 
         FROM orders o 
         JOIN plans p ON o.planId = p.id 
         WHERE o.id = ? AND o.userId = ?`,
        [req.params.id, req.user.id],
        (err, order) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            // Parse VPS details if present
            if (order.vpsDetails) {
                try {
                    order.vpsDetails = JSON.parse(order.vpsDetails);
                } catch (e) {
                    order.vpsDetails = null;
                }
            }

            res.json({ order });
        }
    );
});

// Upload Payment Screenshot
router.post('/:id/upload-payment', authenticateUser, upload.single('screenshot'), (req, res) => {
    const { transactionId } = req.body;
    const screenshotPath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!screenshotPath) {
        return res.status(400).json({ error: 'Screenshot is required' });
    }

    db.run(
        'UPDATE orders SET paymentScreenshot = ?, transactionId = ?, status = ? WHERE id = ? AND userId = ?',
        [screenshotPath, transactionId, 'payment_uploaded', req.params.id, req.user.id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to update order' });
            }

            // Fetch order details for notification
            db.get(
                `SELECT o.*, u.fullName as userName, u.email as userEmail, u.discordId as userDiscord, p.name as planName 
         FROM orders o 
         JOIN users u ON o.userId = u.id 
         JOIN plans p ON o.planId = p.id 
         WHERE o.id = ?`,
                [req.params.id],
                (err, orderData) => {
                    if (!err && orderData) {
                        // Send Discord notification
                        const fullScreenshotUrl = `${req.protocol}://${req.get('host')}${screenshotPath}`;
                        sendOrderNotification({ ...orderData, screenshotUrl: fullScreenshotUrl });
                    }
                }
            );

            res.json({ message: 'Payment uploaded successfully' });
        }
    );
});

// Cancel Order (User)
router.delete('/:id', authenticateUser, (req, res) => {
    const userId = req.user.id;
    const orderId = req.params.id;

    db.get('SELECT * FROM orders WHERE id = ? AND userId = ?', [orderId, userId], (err, order) => {
        if (err || !order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (order.status !== 'pending_upload' && order.status !== 'rejected') {
            return res.status(400).json({ error: 'Cannot cancel order in current status' });
        }

        db.run('DELETE FROM orders WHERE id = ?', [orderId], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to cancel order' });
            }
            res.json({ message: 'Order cancelled successfully' });
        });
    });
});

// Get User Orders
router.get('/user/:userId', authenticateUser, (req, res) => {
    if (req.user.id != req.params.userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    db.all(
        `SELECT o.*, p.name as planName, p.type as planType 
     FROM orders o 
     JOIN plans p ON o.planId = p.id 
     WHERE o.userId = ? 
     ORDER BY o.createdAt DESC`,
        [req.params.userId],
        (err, orders) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            // Parse VPS details if present
            const formattedOrders = orders.map(order => ({
                ...order,
                vpsDetails: order.vpsDetails ? JSON.parse(order.vpsDetails) : null
            }));

            res.json({ orders: formattedOrders });
        }
    );
});

// Admin: Get All Orders
router.get('/admin/all', authenticateUser, isAdmin, (req, res) => {
    db.all(
        `SELECT o.*, u.fullName as userName, u.email as userEmail, p.name as planName 
     FROM orders o 
     JOIN users u ON o.userId = u.id 
     JOIN plans p ON o.planId = p.id 
     ORDER BY o.createdAt DESC`,
        (err, orders) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ orders });
        }
    );
});

// Admin: Verify Payment & Activate Service
router.put('/:id/verify', authenticateUser, isAdmin, (req, res) => {
    const { vpsDetails, renewalDate } = req.body;
    const vpsDetailsJson = JSON.stringify(vpsDetails);

    db.run(
        'UPDATE orders SET status = ?, vpsDetails = ?, renewalDate = ? WHERE id = ?',
        ['active', vpsDetailsJson, renewalDate, req.params.id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to verify order' });
            }

            // Send notification
            db.get(
                `SELECT o.*, u.fullName as userName, u.email as userEmail 
         FROM orders o 
         JOIN users u ON o.userId = u.id 
         WHERE o.id = ?`,
                [req.params.id],
                (err, orderData) => {
                    if (!err && orderData) {
                        sendOrderUpdateNotification(orderData, 'payment_verified', { adminEmail: req.user.email });
                    }
                }
            );

            res.json({ message: 'Order verified and activated' });
        }
    );
});

// Admin: Reject Payment
router.put('/:id/reject', authenticateUser, isAdmin, (req, res) => {
    const { reason } = req.body;

    db.run(
        'UPDATE orders SET status = ?, rejectionReason = ? WHERE id = ?',
        ['rejected', reason, req.params.id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to reject order' });
            }

            // Send notification
            db.get(
                `SELECT o.*, u.fullName as userName, u.email as userEmail 
         FROM orders o 
         JOIN users u ON o.userId = u.id 
         WHERE o.id = ?`,
                [req.params.id],
                (err, orderData) => {
                    if (!err && orderData) {
                        sendOrderUpdateNotification(orderData, 'rejected', { adminEmail: req.user.email });
                    }
                }
            );

            res.json({ message: 'Order rejected' });
        }
    );
});

// ===== MANAGER PAGE ENDPOINTS =====

// Get Active Orders for Manager Page
router.get('/manager/active', authenticateUser, isAdmin, (req, res) => {
    db.all(
        `SELECT 
            o.id,
            u.fullName as customer,
            u.email as customerEmail,
            p.name as plan,
            p.type as planType,
            o.createdAt as orderDate,
            o.renewalDate,
            o.finalPrice as amount,
            o.status
         FROM orders o
         JOIN users u ON o.userId = u.id
         JOIN plans p ON o.planId = p.id
         WHERE o.status = 'active'
         ORDER BY o.renewalDate ASC`,
        (err, orders) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ orders });
        }
    );
});

// Get Expired Orders for Manager Page
router.get('/manager/expired', authenticateUser, isAdmin, (req, res) => {
    db.all(
        `SELECT 
            o.id,
            u.fullName as customer,
            u.email as customerEmail,
            p.name as plan,
            p.type as planType,
            o.renewalDate as expiredDate,
            o.finalPrice as amount,
            o.status,
            CAST((julianday('now') - julianday(o.renewalDate)) AS INTEGER) as daysSinceExpiry
         FROM orders o
         JOIN users u ON o.userId = u.id
         JOIN plans p ON o.planId = p.id
         WHERE o.renewalDate < DATE('now') AND o.status = 'active'
         ORDER BY o.renewalDate ASC`,
        (err, orders) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ orders });
        }
    );
});

// Clear Expired Orders (Admin Only)
router.delete('/manager/expired', authenticateUser, isAdmin, (req, res) => {
    db.run(
        `UPDATE orders 
         SET status = 'expired', updatedAt = CURRENT_TIMESTAMP
         WHERE renewalDate < DATE('now') AND status = 'active'`,
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to clear expired orders' });
            }
            res.json({
                message: 'Expired orders cleared successfully',
                count: this.changes
            });
        }
    );
});

export default router;

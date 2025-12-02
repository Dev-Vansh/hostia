import express from 'express';
import { db } from '../database.js';
import { authenticateUser, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', authenticateUser, isAdmin, async (req, res) => {
    try {
        // Total Revenue: Sum of all completed and active orders (paid orders)
        const totalRevenue = await new Promise((resolve, reject) => {
            db.get(
                "SELECT SUM(finalPrice) as total FROM orders WHERE status IN ('active', 'completed')",
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row?.total || 0);
                }
            );
        });

        // Daily Sales: Today's accepted sales
        const dailySales = await new Promise((resolve, reject) => {
            db.get(
                `SELECT SUM(finalPrice) as total, COUNT(*) as count 
                 FROM orders 
                 WHERE status IN ('active', 'completed') 
                 AND DATE(createdAt) = DATE('now')`,
                (err, row) => {
                    if (err) reject(err);
                    else resolve({ amount: row?.total || 0, count: row?.count || 0 });
                }
            );
        });

        // Monthly Sales: This month's accepted sales
        const monthlySales = await new Promise((resolve, reject) => {
            db.get(
                `SELECT SUM(finalPrice) as total, COUNT(*) as count 
                 FROM orders 
                 WHERE status IN ('active', 'completed') 
                 AND strftime('%Y-%m', createdAt) = strftime('%Y-%m', 'now')`,
                (err, row) => {
                    if (err) reject(err);
                    else resolve({ amount: row?.total || 0, count: row?.count || 0 });
                }
            );
        });

        // Yearly Sales: This year's accepted sales
        const yearlySales = await new Promise((resolve, reject) => {
            db.get(
                `SELECT SUM(finalPrice) as total, COUNT(*) as count 
                 FROM orders 
                 WHERE status IN ('active', 'completed') 
                 AND strftime('%Y', createdAt) = strftime('%Y', 'now')`,
                (err, row) => {
                    if (err) reject(err);
                    else resolve({ amount: row?.total || 0, count: row?.count || 0 });
                }
            );
        });

        const totalSales = await new Promise((resolve, reject) => {
            db.get("SELECT COUNT(*) as count FROM orders", (err, row) => {
                if (err) reject(err);
                else resolve(row?.count || 0);
            });
        });

        // Active Orders: Count of active services/VPS
        const activeOrders = await new Promise((resolve, reject) => {
            db.get("SELECT COUNT(*) as count FROM orders WHERE status = 'active'", (err, row) => {
                if (err) reject(err);
                else resolve(row?.count || 0);
            });
        });

        // Pending Payments: Orders waiting for payment or payment verification + amount
        const pendingPayments = await new Promise((resolve, reject) => {
            db.get(
                `SELECT COUNT(*) as count, SUM(finalPrice) as amount 
                 FROM orders 
                 WHERE status IN ('pending_upload', 'payment_uploaded')`,
                (err, row) => {
                    if (err) reject(err);
                    else resolve({ count: row?.count || 0, amount: row?.amount || 0 });
                }
            );
        });

        const totalUsers = await new Promise((resolve, reject) => {
            db.get("SELECT COUNT(*) as count FROM users WHERE role = 'user'", (err, row) => {
                if (err) reject(err);
                else resolve(row?.count || 0);
            });
        });

        // Recent Orders: Latest orders sorted by creation date
        const recentOrders = await new Promise((resolve, reject) => {
            db.all(
                `SELECT o.id, u.fullName as userName, p.name as planName, o.finalPrice, o.status, o.createdAt 
                 FROM orders o 
                 JOIN users u ON o.userId = u.id 
                 JOIN plans p ON o.planId = p.id 
                 ORDER BY o.createdAt DESC LIMIT 5`,
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows || []);
                }
            );
        });

        // VPS/Service Type Breakdown: Count by plan type for active orders
        const serviceTypeCounts = await new Promise((resolve, reject) => {
            db.all(
                `SELECT p.type, COUNT(*) as count 
                 FROM orders o 
                 JOIN plans p ON o.planId = p.id 
                 WHERE o.status = 'active'
                 GROUP BY p.type`,
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows || []);
                }
            );
        });

        const analytics = {
            orderStats: {
                totalRevenue,
                totalSales,
                activeOrders,
                pendingPayments,
                dailySales,
                monthlySales,
                yearlySales,
                serviceTypeCounts
            },
            userStats: {
                totalUsers
            },
            recentOrders
        };

        res.json(analytics);
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

export default router;

import express from 'express';
import { db } from '../database.js';
import { authenticateUser, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Validate promo code (case-insensitive)
// Validate promo code (case-insensitive)
router.post('/validate', authenticateUser, (req, res) => {
    const { code, planId, price } = req.body;
    console.log('Validating promo:', { code, planId, price });

    if (!code || !planId || price === undefined) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Make promo code case-insensitive and trim whitespace
    const upperCode = code.trim().toUpperCase();

    db.get('SELECT * FROM promos WHERE UPPER(code) = ? AND isActive = 1', [upperCode], (err, promo) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        console.log('Promo found:', promo);

        if (!promo) {
            return res.status(404).json({ error: 'Invalid promo code' });
        }

        // Check expiry
        if (promo.expiryDate && new Date(promo.expiryDate) < new Date()) {
            console.log('Promo expired');
            return res.status(400).json({ error: 'Promo code expired' });
        }

        // Check usage limit
        if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
            console.log('Usage limit reached');
            return res.status(400).json({ error: 'Promo code usage limit reached' });
        }

        // Check plan applicability
        if (promo.applicablePlans) {
            try {
                const allowedPlans = JSON.parse(promo.applicablePlans);
                console.log('Allowed plans:', allowedPlans, 'Current plan:', planId);
                // If allowedPlans is empty, it means the promo is applicable to ALL plans
                if (allowedPlans.length > 0 && !allowedPlans.includes(parseInt(planId))) {
                    console.log('Plan not applicable');
                    return res.status(400).json({ error: 'Promo code not applicable for this plan' });
                }
            } catch (e) {
                console.error('Error parsing applicablePlans:', e);
            }
        }

        // Calculate discount
        let discountAmount = 0;
        if (promo.type === 'percentage') {
            discountAmount = (price * promo.value) / 100;
        } else {
            discountAmount = promo.value;
        }

        // Ensure discount doesn't exceed price
        discountAmount = Math.min(discountAmount, price);

        res.json({
            valid: true,
            discountAmount,
            finalPrice: price - discountAmount,
            promoCode: promo.code  // Return actual stored code (uppercase)
        });
    });
});

// Admin: Get all promos
router.get('/', authenticateUser, isAdmin, (req, res) => {
    db.all('SELECT * FROM promos ORDER BY createdAt DESC', (err, promos) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ promos });
    });
});

// Admin: Create promo
router.post('/', authenticateUser, isAdmin, (req, res) => {
    const { code, type, value, expiryDate, usageLimit, applicablePlans, isActive } = req.body;

    db.run(
        'INSERT INTO promos (code, type, value, expiryDate, usageLimit, applicablePlans, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [code.trim().toUpperCase(), type, value, expiryDate || null, usageLimit || null, JSON.stringify(applicablePlans || []), isActive !== undefined ? isActive : 1],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to create promo' });
            }
            res.status(201).json({ message: 'Promo created successfully', id: this.lastID });
        }
    );
});

// Admin: Update promo
router.put('/:id', authenticateUser, isAdmin, (req, res) => {
    const { code, type, value, expiryDate, usageLimit, applicablePlans, isActive } = req.body;

    db.run(
        'UPDATE promos SET code = ?, type = ?, value = ?, expiryDate = ?, usageLimit = ?, applicablePlans = ?, isActive = ? WHERE id = ?',
        [code.trim().toUpperCase(), type, value, expiryDate || null, usageLimit || null, JSON.stringify(applicablePlans || []), isActive, req.params.id],
        (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to update promo' });
            }
            res.json({ message: 'Promo updated successfully' });
        }
    );
});

// Admin: Delete promo
router.delete('/:id', authenticateUser, isAdmin, (req, res) => {
    db.run('DELETE FROM promos WHERE id = ?', [req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete promo' });
        }
        res.json({ message: 'Promo deleted successfully' });
    });
});

export default router;

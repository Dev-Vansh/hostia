import express from 'express';
import { db } from '../database.js';
import { authenticateUser, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all plans (including out of stock)
router.get('/', (req, res) => {
    db.all('SELECT * FROM plans ORDER BY type, price', (err, plans) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        const formattedPlans = plans.map(plan => ({
            ...plan,
            features: JSON.parse(plan.features)
        }));

        res.json({ plans: formattedPlans });
    });
});

// Get specific plan
router.get('/:id', (req, res) => {
    db.get('SELECT * FROM plans WHERE id = ?', [req.params.id], (err, plan) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        plan.features = JSON.parse(plan.features);
        res.json({ plan });
    });
});

// Admin: Create plan
router.post('/', authenticateUser, isAdmin, (req, res) => {
    const { name, type, processor, price, features } = req.body;

    if (!name || !type || !price || !features) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const featuresJson = JSON.stringify(features);

    db.run(
        'INSERT INTO plans (name, type, processor, price, features) VALUES (?, ?, ?, ?, ?)',
        [name, type, processor, price, featuresJson],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to create plan' });
            }
            res.status(201).json({ message: 'Plan created successfully', id: this.lastID });
        }
    );
});

// Admin: Update plan
router.put('/:id', authenticateUser, isAdmin, (req, res) => {
    const { name, type, processor, price, features, isActive } = req.body;
    const featuresJson = JSON.stringify(features);

    db.run(
        'UPDATE plans SET name = ?, type = ?, processor = ?, price = ?, features = ?, isActive = ? WHERE id = ?',
        [name, type, processor, price, featuresJson, isActive, req.params.id],
        (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to update plan' });
            }
            res.json({ message: 'Plan updated successfully' });
        }
    );
});

// Admin: Delete plan
router.delete('/:id', authenticateUser, isAdmin, (req, res) => {
    db.run('DELETE FROM plans WHERE id = ?', [req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete plan' });
        }
        res.json({ message: 'Plan deleted successfully' });
    });
});

export default router;

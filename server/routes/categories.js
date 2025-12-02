import express from 'express';
import { db } from '../database.js';
import { authenticateUser, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all categories
router.get('/', (req, res) => {
    const { type } = req.query;
    let query = 'SELECT * FROM categories WHERE isActive = 1';
    const params = [];

    if (type) {
        query += ' AND type = ?';
        params.push(type);
    }

    query += ' ORDER BY displayOrder ASC, name ASC';

    db.all(query, params, (err, categories) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ categories });
    });
});

// Get all categories (admin - includes inactive)
router.get('/admin/all', authenticateUser, isAdmin, (req, res) => {
    db.all('SELECT * FROM categories ORDER BY type ASC, displayOrder ASC, name ASC', (err, categories) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ categories });
    });
});

// Create category (admin only)
router.post('/', authenticateUser, isAdmin, (req, res) => {
    const { name, type, displayOrder } = req.body;

    if (!name || !type) {
        return res.status(400).json({ error: 'Name and type are required' });
    }

    db.run(
        'INSERT INTO categories (name, type, displayOrder) VALUES (?, ?, ?)',
        [name.trim(), type, displayOrder || 0],
        function (err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(400).json({ error: 'Category with this name already exists' });
                }
                return res.status(500).json({ error: 'Failed to create category' });
            }
            res.status(201).json({
                message: 'Category created successfully',
                categoryId: this.lastID
            });
        }
    );
});

// Update category (admin only)
router.put('/:id', authenticateUser, isAdmin, (req, res) => {
    const { name, type, isActive, displayOrder } = req.body;

    db.run(
        'UPDATE categories SET name = ?, type = ?, isActive = ?, displayOrder = ? WHERE id = ?',
        [name.trim(), type, isActive !== undefined ? isActive : 1, displayOrder || 0, req.params.id],
        function (err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(400).json({ error: 'Category with this name already exists' });
                }
                return res.status(500).json({ error: 'Failed to update category' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.json({ message: 'Category updated successfully' });
        }
    );
});

// Delete category (admin only)
router.delete('/:id', authenticateUser, isAdmin, (req, res) => {
    // Check if any plans are using this category
    db.get('SELECT COUNT(*) as count FROM plans WHERE categoryId = ?', [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.count > 0) {
            return res.status(400).json({
                error: `Cannot delete category. ${result.count} plan(s) are using this category.`
            });
        }

        db.run('DELETE FROM categories WHERE id = ?', [req.params.id], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to delete category' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.json({ message: 'Category deleted successfully' });
        });
    });
});

export default router;

import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../database.js';
import { authenticateUser, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin only) - includes order count
router.get('/', authenticateUser, isAdmin, (req, res) => {
    db.all(
        `SELECT u.id, u.fullName, u.email, u.phoneNumber, u.discordId, u.role, u.createdAt,
         COUNT(o.id) as orderCount
         FROM users u
         LEFT JOIN orders o ON u.id = o.userId
         GROUP BY u.id
         ORDER BY u.createdAt DESC`,
        (err, users) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ users });
        }
    );
});

// Get user by ID (admin only)
router.get('/:id', authenticateUser, isAdmin, (req, res) => {
    db.get(
        'SELECT id, fullName, email, phoneNumber, discordId, role, createdAt FROM users WHERE id = ?',
        [req.params.id],
        (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ user });
        }
    );
});

// Create new user (admin only)
router.post('/', authenticateUser, isAdmin, async (req, res) => {
    try {
        const { fullName, email, phoneNumber, discordId, password, role } = req.body;

        if (!fullName || !email || !phoneNumber || !password) {
            return res.status(400).json({ error: 'Full name, email, phone number, and password are required' });
        }

        // Validate role
        const userRole = role || 'user';
        if (!['user', 'admin'].includes(userRole)) {
            return res.status(400).json({ error: 'Invalid role. Must be "user" or "admin"' });
        }

        // Check if user already exists
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, existingUser) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (existingUser) {
                return res.status(400).json({ error: 'User with this email already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            db.run(
                'INSERT INTO users (fullName, email, phoneNumber, discordId, password, role) VALUES (?, ?, ?, ?, ?, ?)',
                [fullName, email, phoneNumber, discordId || null, hashedPassword, userRole],
                function (err) {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to create user' });
                    }

                    res.status(201).json({
                        message: 'User created successfully',
                        userId: this.lastID,
                        user: {
                            id: this.lastID,
                            fullName,
                            email,
                            phoneNumber,
                            discordId,
                            role: userRole
                        }
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user details (admin only)
router.put('/:id', authenticateUser, isAdmin, async (req, res) => {
    try {
        const { fullName, email, phoneNumber, discordId, password } = req.body;

        // Get existing user first
        db.get('SELECT * FROM users WHERE id = ?', [req.params.id], async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Build update query dynamically based on provided fields
            const updates = [];
            const values = [];

            if (fullName !== undefined) {
                updates.push('fullName = ?');
                values.push(fullName);
            }
            if (email !== undefined) {
                // Check if new email is already taken by another user
                const existingUser = await new Promise((resolve, reject) => {
                    db.get('SELECT * FROM users WHERE email = ? AND id != ?', [email, req.params.id], (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                });

                if (existingUser) {
                    return res.status(400).json({ error: 'Email already in use by another user' });
                }

                updates.push('email = ?');
                values.push(email);
            }
            if (phoneNumber !== undefined) {
                updates.push('phoneNumber = ?');
                values.push(phoneNumber);
            }
            if (discordId !== undefined) {
                updates.push('discordId = ?');
                values.push(discordId || null);
            }
            if (password !== undefined && password !== '') {
                const hashedPassword = await bcrypt.hash(password, 10);
                updates.push('password = ?');
                values.push(hashedPassword);
                // Increment token version to invalidate all existing sessions
                updates.push('tokenVersion = tokenVersion + 1');
            }

            if (updates.length === 0) {
                return res.status(400).json({ error: 'No fields to update' });
            }

            values.push(req.params.id);
            const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

            db.run(query, values, function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to update user' });
                }
                res.json({ message: 'User updated successfully' });
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user role (admin only)
router.put('/:id/role', authenticateUser, isAdmin, (req, res) => {
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Must be "user" or "admin"' });
    }

    // Prevent removing the last admin
    if (role === 'user') {
        db.get('SELECT COUNT(*) as adminCount FROM users WHERE role = ?', ['admin'], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            // Check if this is the user being demoted
            db.get('SELECT role FROM users WHERE id = ?', [req.params.id], (err, user) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }
                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }

                if (user.role === 'admin' && result.adminCount <= 1) {
                    return res.status(400).json({ error: 'Cannot remove the last admin user' });
                }

                updateRole();
            });
        });
    } else {
        updateRole();
    }

    function updateRole() {
        db.run(
            'UPDATE users SET role = ? WHERE id = ?',
            [role, req.params.id],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to update role' });
                }
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'User not found' });
                }
                res.json({ message: 'User role updated successfully' });
            }
        );
    }
});

// Delete user (admin only)
router.delete('/:id', authenticateUser, isAdmin, (req, res) => {
    // Check if user has any orders
    db.get('SELECT COUNT(*) as orderCount FROM orders WHERE userId = ?', [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.orderCount > 0) {
            return res.status(400).json({
                error: `Cannot delete user. User has ${result.orderCount} order(s). Please handle those first.`
            });
        }

        // Check if this is an admin
        db.get('SELECT role FROM users WHERE id = ?', [req.params.id], (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Prevent deleting the last admin
            if (user.role === 'admin') {
                db.get('SELECT COUNT(*) as adminCount FROM users WHERE role = ?', ['admin'], (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: 'Database error' });
                    }
                    if (result.adminCount <= 1) {
                        return res.status(400).json({ error: 'Cannot delete the last admin user' });
                    }
                    performDelete();
                });
            } else {
                performDelete();
            }
        });
    });

    function performDelete() {
        db.run('DELETE FROM users WHERE id = ?', [req.params.id], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to delete user' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ message: 'User deleted successfully' });
        });
    }
});

export default router;

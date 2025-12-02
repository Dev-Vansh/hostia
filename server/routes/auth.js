import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../database.js';
import { authenticateUser, generateToken } from '../middleware/auth.js';

const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, phoneNumber, discordId, password } = req.body;

        if (!fullName || !email || !phoneNumber || !password) {
            return res.status(400).json({ error: 'All fields except Discord ID are required' });
        }

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
                [fullName, email, phoneNumber, discordId, hashedPassword, 'user'],
                function (err) {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to create user' });
                    }

                    res.status(201).json({
                        message: 'User registered successfully',
                        userId: this.lastID
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        db.get('SELECT * FROM users WHERE email = ? AND role = ?', [email, 'user'], async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = generateToken(user);

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    discordId: user.discordId,
                    role: user.role
                }
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        db.get('SELECT * FROM users WHERE email = ? AND role = ?', [email, 'admin'], async (err, admin) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (!admin) {
                return res.status(401).json({ error: 'Invalid admin credentials' });
            }

            const isPasswordValid = await bcrypt.compare(password, admin.password);

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid admin credentials' });
            }

            const token = generateToken(admin);

            res.json({
                message: 'Admin login successful',
                token,
                user: {
                    id: admin.id,
                    fullName: admin.fullName,
                    email: admin.email,
                    role: admin.role
                }
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Current User
router.get('/me', authenticateUser, (req, res) => {
    db.get('SELECT id, fullName, email, phoneNumber, discordId, role FROM users WHERE id = ?', [req.user.id], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    });
});

export default router;

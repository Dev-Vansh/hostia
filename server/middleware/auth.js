import jwt from 'jsonwebtoken';
import { db } from '../database.js';

const authenticateUser = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check token version in database
        db.get('SELECT tokenVersion FROM users WHERE id = ?', [decoded.id], (err, user) => {
            if (err || !user) {
                return res.status(401).json({ error: 'Invalid token' });
            }

            // Compare token version with current user version
            const tokenVersion = decoded.tokenVersion || 0;
            const userVersion = user.tokenVersion || 0;

            if (tokenVersion !== userVersion) {
                return res.status(401).json({ error: 'Session expired. Please login again.' });
            }

            req.user = decoded;
            next();
        });
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
            tokenVersion: user.tokenVersion || 0
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

export { authenticateUser, isAdmin, generateToken };

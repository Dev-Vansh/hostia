import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initializeDatabase } from './database.js';
import authRoutes from './routes/auth.js';
import planRoutes from './routes/plans.js';
import promoRoutes from './routes/promos.js';
import orderRoutes from './routes/orders.js';
import analyticsRoutes from './routes/analytics.js';
import categoryRoutes from './routes/categories.js';
import usersRoutes from './routes/users.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✓ Created uploads directory');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? false : '*', // Adjust for production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/promos', promoRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', usersRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
initializeDatabase()
    .then(() => {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`
╔═══════════════════════════════════════╗
║   🚀 HOSTIA Backend Server Running   ║
║   Port: ${PORT}                         ║
╚═══════════════════════════════════════╝
      `);
            console.log(`API: http://localhost:${PORT}/api`);
            console.log(`Admin: ${process.env.ADMIN_EMAIL}`);
        });
    })
    .catch((err) => {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    });

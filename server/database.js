import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'hostia.db');
const db = new sqlite3.Database(dbPath);

const initializeDatabase = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Users table
            db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          fullName TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phoneNumber TEXT NOT NULL,
          discordId TEXT,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

            // Categories table (for VPS processor types, etc.)
            db.run(`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          type TEXT NOT NULL,
          isActive INTEGER DEFAULT 1,
          displayOrder INTEGER DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

            // Plans table
            db.run(`
        CREATE TABLE IF NOT EXISTS plans (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          processor TEXT,
          categoryId INTEGER,
          price REAL NOT NULL,
          features TEXT NOT NULL,
          isActive INTEGER DEFAULT 1,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (categoryId) REFERENCES categories(id)
        )
      `);

            // Orders table
            db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          planId INTEGER NOT NULL,
          originalPrice REAL NOT NULL,
          discountAmount REAL DEFAULT 0,
          finalPrice REAL NOT NULL,
          promoCode TEXT,
          items TEXT,
          paymentScreenshot TEXT,
          transactionId TEXT,
          status TEXT DEFAULT 'pending_upload',
          rejectionReason TEXT,
          vpsDetails TEXT,
          renewalDate DATE,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id),
          FOREIGN KEY (planId) REFERENCES plans(id)
        )
      `);

            // Promos table
            db.run(`
        CREATE TABLE IF NOT EXISTS promos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT UNIQUE NOT NULL,
          type TEXT NOT NULL,
          value REAL NOT NULL,
          expiryDate DATE,
          usageLimit INTEGER,
          usedCount INTEGER DEFAULT 0,
          applicablePlans TEXT,
          isActive INTEGER DEFAULT 1,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

            // Invoices table
            db.run(`
        CREATE TABLE IF NOT EXISTS invoices (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          orderId INTEGER NOT NULL,
          userId INTEGER NOT NULL,
          amount REAL NOT NULL,
          status TEXT DEFAULT 'pending',
          generatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (orderId) REFERENCES orders(id),
          FOREIGN KEY (userId) REFERENCES users(id)
        )
      `);

            // Audit Logs table
            db.run(`
        CREATE TABLE IF NOT EXISTS auditLogs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          adminId INTEGER,
          action TEXT NOT NULL,
          targetType TEXT,
          targetId INTEGER,
          details TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (adminId) REFERENCES users(id)
        )
      `, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('✓ Database tables created successfully');
                    initializeDefaultData();
                    resolve();
                }
            });
        });
    });
};

const initializeDefaultData = async () => {
    // Check if admin exists
    db.get('SELECT * FROM users WHERE role = ?', ['admin'], async (err, row) => {
        if (!row) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
            db.run(
                'INSERT INTO users (fullName, email, phoneNumber, password, role) VALUES (?, ?, ?, ?, ?)',
                ['Admin', process.env.ADMIN_EMAIL, '0000000000', hashedPassword, 'admin'],
                (err) => {
                    if (err) {
                        console.error('Error creating admin:', err);
                    } else {
                        console.log('✓ Default admin user created');
                    }
                }
            );
        }
    });

    // Check if plans exist
    db.get('SELECT * FROM plans LIMIT 1', (err, row) => {
        if (!row) {
            // Bot Hosting Plans
            const botPlans = [
                { name: 'Starter', type: 'bot', price: 30, features: JSON.stringify(['1 GB RAM', '10 GB Storage', '1 CPU Core', '24/7 Support', 'DDoS Protection']) },
                { name: 'Professional', type: 'bot', price: 60, features: JSON.stringify(['2 GB RAM', '25 GB Storage', '2 CPU Cores', '24/7 Priority Support', 'DDoS Protection', 'Free Backups']) },
                { name: 'Enterprise', type: 'bot', price: 90, features: JSON.stringify(['4 GB RAM', '50 GB Storage', '4 CPU Cores', '24/7 Premium Support', 'Advanced DDoS Protection', 'Daily Backups', 'Dedicated IP']) }
            ];

            // VPS Plans - Intel v2
            const intelV2Plans = [
                { name: 'Intel v2 - 16GB', type: 'vps', processor: 'Intel Xeon v2', price: 230, features: JSON.stringify(['16 GB RAM', '70 GB Disk', '4 vCore', 'Full Root Access', '1 Dedicated IP', '1 Gbps Network']) },
                { name: 'Intel v2 - 24GB', type: 'vps', processor: 'Intel Xeon v2', price: 330, features: JSON.stringify(['24 GB RAM', '90 GB Disk', '6 vCore', 'Full Root Access', '1 Dedicated IP', '1 Gbps Network']) },
                { name: 'Intel v2 - 32GB', type: 'vps', processor: 'Intel Xeon v2', price: 500, features: JSON.stringify(['32 GB RAM', '128 GB Disk', '8 vCore', 'Full Root Access', '1 Dedicated IP', '1 Gbps Network']) },
                { name: 'Intel v2 - 48GB', type: 'vps', processor: 'Intel Xeon v2', price: 750, features: JSON.stringify(['48 GB RAM', '200 GB Disk', '10 vCore', 'Full Root Access', '1 Dedicated IP', '1 Gbps Network']) },
                { name: 'Intel v2 - 64GB', type: 'vps', processor: 'Intel Xeon v2', price: 990, features: JSON.stringify(['64 GB RAM', '300 GB Disk', '12 vCore', 'Full Root Access', '1 Dedicated IP', '1 Gbps Network']) }
            ];

            // VPS Plans - Intel v4
            const intelV4Plans = [
                { name: 'Intel v4 - 16GB', type: 'vps', processor: 'Intel Xeon v4', price: 330, features: JSON.stringify(['16 GB RAM', '70 GB Disk', '4 vCore', 'Full Root Access', '1 Dedicated IP', '1 Gbps Network']) },
                { name: 'Intel v4 - 24GB', type: 'vps', processor: 'Intel Xeon v4', price: 670, features: JSON.stringify(['24 GB RAM', '90 GB Disk', '6 vCore', 'Full Root Access', '1 Dedicated IP', '1 Gbps Network']) },
                { name: 'Intel v4 - 32GB', type: 'vps', processor: 'Intel Xeon v4', price: 830, features: JSON.stringify(['32 GB RAM', '128 GB Disk', '8 vCore', 'Full Root Access', '1 Dedicated IP', '1 Gbps Network']) },
                { name: 'Intel v4 - 48GB', type: 'vps', processor: 'Intel Xeon v4', price: 1150, features: JSON.stringify(['48 GB RAM', '200 GB Disk', '10 vCore', 'Full Root Access', '1 Dedicated IP', '1 Gbps Network']) },
                { name: 'Intel v4 - 64GB', type: 'vps', processor: 'Intel Xeon v4', price: 1500, features: JSON.stringify(['64 GB RAM', '300 GB Disk', '12 vCore', 'Full Root Access', '1 Dedicated IP', '1 Gbps Network']) }
            ];

            // VPS Plans - Ryzen 9
            const ryzenPlans = [
                { name: 'Ryzen 9 - 8GB', type: 'vps', processor: 'AMD Ryzen 9', price: 600, features: JSON.stringify(['8 GB RAM', '70 GB Disk', '4 vCore', 'Full Root Access', '1 Dedicated IP', '1 Gbps Network']) },
                { name: 'Ryzen 9 - 16GB', type: 'vps', processor: 'AMD Ryzen 9', price: 1400, features: JSON.stringify(['16 GB RAM', '80 GB Disk', '6 vCore', 'Full Root Access', '1 Dedicated IP', '1 Gbps Network']) },
                { name: 'Ryzen 9 - 24GB', type: 'vps', processor: 'AMD Ryzen 9', price: 2000, features: JSON.stringify(['24 GB RAM', '90 GB Disk', '6 vCore', 'Full Root Access', '1 Dedicated IP', '1 Gbps Network']) },
                { name: 'Ryzen 9 - 32GB', type: 'vps', processor: 'AMD Ryzen 9', price: 3050, features: JSON.stringify(['32 GB RAM', '128 GB Disk', '8 vCore', 'Full Root Access', '1 Dedicated IP', '1 Gbps Network']) },
                { name: 'Ryzen 9 - 48GB', type: 'vps', processor: 'AMD Ryzen 9', price: 4620, features: JSON.stringify(['48 GB RAM', '200 GB Disk', '10 vCore', 'Full Root Access', '1 Dedicated IP', '1 Gbps Network']) }
            ];

            const allPlans = [...botPlans, ...intelV2Plans, ...intelV4Plans, ...ryzenPlans];

            const stmt = db.prepare('INSERT INTO plans (name, type, processor, price, features) VALUES (?, ?, ?, ?, ?)');
            allPlans.forEach(plan => {
                stmt.run(plan.name, plan.type, plan.processor || null, plan.price, plan.features);
            });
            stmt.finalize(() => {
                console.log('✓ Default plans created');
            });
        }
    });
};

export { db, initializeDatabase };

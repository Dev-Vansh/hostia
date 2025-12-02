import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'hostia.db');
const db = new sqlite3.Database(dbPath);

console.log('Creating categories table...');

db.run(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    isActive INTEGER DEFAULT 1,
    displayOrder INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
    if (err) {
        console.error('Error creating categories table:', err);
    } else {
        console.log('✓ Categories table created successfully');
    }

    // Add categoryId column to plans table if it doesn't exist
    db.run(`
        ALTER TABLE plans ADD COLUMN categoryId INTEGER REFERENCES categories(id)
    `, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('Error adding categoryId to plans:', err);
        } else {
            console.log('✓ Added categoryId column to plans table');
        }

        db.close(() => {
            console.log('Database update complete!');
            process.exit(0);
        });
    });
});

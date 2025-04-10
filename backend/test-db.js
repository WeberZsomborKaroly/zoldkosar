const mysql = require('mysql2');

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create MySQL connection pool
const pool = mysql.createPool(dbConfig).promise();

async function testDatabaseConnection() {
    try {
        // Create database if not exists
        await pool.query('CREATE DATABASE IF NOT EXISTS webshop_project');
        console.log('Database created or already exists');

        // Switch to the database
        await pool.query('USE webshop_project');
        console.log('Using webshop_project database');

        // Create kategoriak table if not exists
        await pool.query(`
            CREATE TABLE IF NOT EXISTS kategoriak (
                id INT PRIMARY KEY AUTO_INCREMENT,
                nev VARCHAR(100) NOT NULL,
                aktiv TINYINT(1) DEFAULT 1
            )
        `);
        console.log('Kategoriak table created or already exists');

        // Create termekek table if not exists
        await pool.query(`
            CREATE TABLE IF NOT EXISTS termekek (
                id INT PRIMARY KEY AUTO_INCREMENT,
                nev VARCHAR(255) NOT NULL,
                leiras TEXT,
                ar DECIMAL(10,2) NOT NULL,
                akcios_ar DECIMAL(10,2),
                keszlet INT NOT NULL DEFAULT 0,
                kategoria_id INT,
                kep VARCHAR(255),
                aktiv TINYINT(1) DEFAULT 1,
                kiszereles VARCHAR(50),
                akcios TINYINT(1) DEFAULT 0,
                akcio_kezdete DATETIME,
                akcio_vege DATETIME,
                hivatkozas VARCHAR(255),
                tizennyolc_plusz TINYINT(1) DEFAULT 0,
                FOREIGN KEY (kategoria_id) REFERENCES kategoriak(id)
            )
        `);
        console.log('Termekek table created or already exists');

        // Insert sample categories if they don't exist
        const categories = [
            { nev: 'Pékáru' },
            { nev: 'Tejtermékek' },
            { nev: 'Húsáru' },
            { nev: 'Zöldség és gyümölcs' },
            { nev: 'Italok' },
            { nev: 'Szárazáru' },
            { nev: 'Fagyasztott termékek' },
            { nev: 'Édességek' }
        ];

        for (const category of categories) {
            await pool.query('INSERT IGNORE INTO kategoriak (nev) VALUES (?)', [category.nev]);
        }
        console.log('Sample categories inserted');

        // Insert sample products if they don't exist
        const products = [
            {
                nev: 'Fehér kenyér',
                leiras: 'Friss fehér kenyér',
                ar: 699,
                keszlet: 50,
                kategoria_id: 1,
                kep: 'kenyer.jpg'
            },
            {
                nev: 'Tej 2,8%',
                leiras: 'Friss tehéntej',
                ar: 499,
                keszlet: 100,
                kategoria_id: 2,
                kep: 'tej.jpg'
            },
            {
                nev: 'Csirkemell filé',
                leiras: 'Friss csirkemell filé',
                ar: 1999,
                keszlet: 30,
                kategoria_id: 3,
                kep: 'csirkemell.jpg'
            }
        ];

        for (const product of products) {
            await pool.query(`
                INSERT IGNORE INTO termekek 
                (nev, leiras, ar, keszlet, kategoria_id, kep) 
                VALUES (?, ?, ?, ?, ?, ?)
            `, [product.nev, product.leiras, product.ar, product.keszlet, product.kategoria_id, product.kep]);
        }
        console.log('Sample products inserted');

        // Test connection
        await pool.query('SELECT 1');
        console.log('Successfully connected to MySQL database');

        process.exit(0);
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
}

// Run the test
testDatabaseConnection();

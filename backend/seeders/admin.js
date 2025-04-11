const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const config = require('../config/config.js');

async function seedAdmin() {
    let connection;
    try {
        console.log('Starting admin user creation...');
        console.log('Database config:', {
            host: config.host,
            user: config.username,
            database: config.database
        });

        
        connection = await mysql.createConnection({
            host: config.host,
            user: config.username,
            password: config.password,
            database: config.database
        });
        console.log('Connected to database successfully');

        
        const [existingAdmin] = await connection.execute(
            'SELECT * FROM felhasznalok WHERE email = ?',
            ['admin@webshop.com']
        );
        console.log('Checked for existing admin:', existingAdmin.length > 0 ? 'Found' : 'Not found');

        if (existingAdmin.length > 0) {
            console.log('Admin user already exists');
            await connection.end();
            return;
        }

        
        const hashedPassword = await bcrypt.hash('admin123', 8);
        console.log('Password hashed successfully');

        await connection.execute(
            `INSERT INTO felhasznalok (
                email, jelszo, szerepkor, vezeteknev, keresztnev, telefon,
                letrehozva, utolso_belepes, aktiv
            ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), 1)`,
            [
                'admin@webshop.com',
                hashedPassword,
                'admin',
                'Admin',
                'User',
                '+36123456789'
            ]
        );

        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error seeding admin user:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed');
        }
    }
}


if (require.main === module) {
    seedAdmin().catch(console.error);
}

module.exports = seedAdmin;

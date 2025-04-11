require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function createAdminUser() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'webshop_project'
    });

    const adminUser = {
        email: 'admin@webshop.com',
        jelszo: await bcrypt.hash('admin123', 10),
        vezeteknev: 'Admin',
        keresztnev: 'User',
        szerepkor: 'admin',
        aktiv: 1
    };

    try {
        
        const [existingAdmin] = await connection.execute(
            'SELECT * FROM felhasznalok WHERE email = ?',
            [adminUser.email]
        );

        if (existingAdmin.length > 0) {
            console.log('Admin user already exists');
            return;
        }

        
        await connection.execute(`
            INSERT INTO felhasznalok 
            (email, jelszo, vezeteknev, keresztnev, szerepkor, aktiv)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            adminUser.email,
            adminUser.jelszo,
            adminUser.vezeteknev,
            adminUser.keresztnev,
            adminUser.szerepkor,
            adminUser.aktiv
        ]);

        console.log('Admin user created successfully');
        console.log('Email: admin@webshop.com');
        console.log('Password: admin123');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await connection.end();
    }
}

createAdminUser();

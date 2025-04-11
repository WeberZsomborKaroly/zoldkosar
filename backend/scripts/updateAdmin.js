const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function updateAdminUser() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'webshop_project'
    });

    try {
        
        const [rows] = await connection.execute(
            'SELECT * FROM felhasznalok WHERE email = ?',
            ['admin@webshop.com']
        );

        if (rows.length === 0) {
            
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await connection.execute(
                'INSERT INTO felhasznalok (email, jelszo, vezeteknev, keresztnev, szerepkor) VALUES (?, ?, ?, ?, ?)',
                ['admin@webshop.com', hashedPassword, 'Admin', 'User', 'admin']
            );
            console.log('Admin felhasználó létrehozva');
        } else {
            
            await connection.execute(
                'UPDATE felhasznalok SET szerepkor = ? WHERE email = ?',
                ['admin', 'admin@webshop.com']
            );
            console.log('Admin jogosultság beállítva');
        }

        
        const [updatedUser] = await connection.execute(
            'SELECT * FROM felhasznalok WHERE email = ?',
            ['admin@webshop.com']
        );

        console.log('Admin felhasználó adatai:');
        console.log('Email:', updatedUser[0].email);
        console.log('Szerepkör:', updatedUser[0].szerepkor);

    } catch (error) {
        console.error('Hiba történt:', error);
    } finally {
        await connection.end();
    }
}

updateAdminUser();

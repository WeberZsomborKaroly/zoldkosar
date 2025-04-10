const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkAdminUser() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'webshop_project'
    });

    try {
        // Lekérdezzük az összes felhasználót
        const [users] = await connection.execute('SELECT * FROM felhasznalok');
        
        console.log('\nÖsszes felhasználó:');
        users.forEach(user => {
            console.log(`\nEmail: ${user.email}`);
            console.log(`Szerepkör: ${user.szerepkor}`);
            console.log(`ID: ${user.id}`);
            console.log('------------------------');
        });

        // Keressük meg az admin felhasználót
        const [adminUser] = await connection.execute(
            'SELECT * FROM felhasznalok WHERE email = ?',
            ['admin@webshop.com']
        );

        if (adminUser.length > 0) {
            console.log('\nAdmin felhasználó részletei:');
            console.log('Email:', adminUser[0].email);
            console.log('Szerepkör:', adminUser[0].szerepkor);
            console.log('ID:', adminUser[0].id);
        } else {
            console.log('\nNem található admin felhasználó!');
        }

    } catch (error) {
        console.error('Hiba történt:', error);
    } finally {
        await connection.end();
    }
}

checkAdminUser();

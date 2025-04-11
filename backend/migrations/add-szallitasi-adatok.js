const mysql = require('mysql2/promise');

async function migrate() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'webshop_project'
        });

        
        await connection.execute(`
            ALTER TABLE felhasznalok
            ADD COLUMN IF NOT EXISTS szallitasi_adatok JSON NULL
            AFTER telefon;
        `);

        console.log('Successfully added szallitasi_adatok column');
        await connection.end();
    } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
    }
}

migrate();

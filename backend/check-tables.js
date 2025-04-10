const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'webshop_project',
    port: 3306
};

async function checkTables() {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
        // Lekérdezzük az összes táblát az adatbázisból
        const [tables] = await connection.query(`
            SHOW TABLES
        `);
        
        console.log('Az adatbázisban található táblák:');
        tables.forEach(table => {
            const tableName = Object.values(table)[0];
            console.log(`- ${tableName}`);
        });
        
        // Ellenőrizzük a kategoria és kategoriak táblákat
        const [kategoriaExists] = await connection.query(`
            SHOW TABLES LIKE 'kategoria'
        `);
        
        const [kategoriakExists] = await connection.query(`
            SHOW TABLES LIKE 'kategoriak'
        `);
        
        if (kategoriaExists.length > 0) {
            console.log('\nA "kategoria" tábla létezik.');
            // Ellenőrizzük a tábla szerkezetét
            const [kategoriaStructure] = await connection.query(`
                DESCRIBE kategoria
            `);
            console.log('A "kategoria" tábla szerkezete:');
            kategoriaStructure.forEach(column => {
                console.log(`- ${column.Field} (${column.Type})`);
            });
        } else {
            console.log('\nA "kategoria" tábla NEM létezik.');
        }
        
        if (kategoriakExists.length > 0) {
            console.log('\nA "kategoriak" tábla létezik.');
            // Ellenőrizzük a tábla szerkezetét
            const [kategoriakStructure] = await connection.query(`
                DESCRIBE kategoriak
            `);
            console.log('A "kategoriak" tábla szerkezete:');
            kategoriakStructure.forEach(column => {
                console.log(`- ${column.Field} (${column.Type})`);
            });
        } else {
            console.log('\nA "kategoriak" tábla NEM létezik.');
        }
        
    } catch (error) {
        console.error('Hiba a táblák ellenőrzésekor:', error);
    } finally {
        await connection.end();
    }
}

checkTables();

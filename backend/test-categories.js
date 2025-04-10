const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'webshop_project',
    port: 3306
};

async function testCategories() {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
        console.log('Kategóriák lekérdezése közvetlenül a kategoriak táblából:');
        const [kategoriak] = await connection.query('SELECT * FROM kategoriak');
        console.log(kategoriak);
        
        // Ellenőrizzük a tábla szerkezetét
        console.log('\nA kategoriak tábla szerkezete:');
        const [struktura] = await connection.query('DESCRIBE kategoriak');
        console.log(struktura);
        
    } catch (error) {
        console.error('Hiba a kategóriák lekérdezésekor:', error);
    } finally {
        await connection.end();
    }
}

testCategories();

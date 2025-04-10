const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'webshop_project',
    port: 3306
};

async function addCategories() {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
        // Ellenőrizzük, hogy vannak-e már kategóriák
        const [existingCategories] = await connection.query('SELECT COUNT(*) as count FROM kategoria');
        const categoryCount = existingCategories[0].count;
        
        if (categoryCount > 0) {
            console.log(`${categoryCount} kategória már létezik az adatbázisban.`);
            return;
        }
        
        // Kategóriák hozzáadása
        const categories = [
            { nev: 'Gyümölcsök', hivatkozas: 'gyumolcsok' },
            { nev: 'Zöldségek', hivatkozas: 'zoldsegek' },
            { nev: 'Tejtermékek', hivatkozas: 'tejtermekek' },
            { nev: 'Pékáruk', hivatkozas: 'pekaruk' },
            { nev: 'Húsok', hivatkozas: 'husok' },
            { nev: 'Italok', hivatkozas: 'italok' },
            { nev: 'Édességek', hivatkozas: 'edessegek' },
            { nev: 'Fűszerek', hivatkozas: 'fuszerek' }
        ];
        
        for (const category of categories) {
            await connection.query(
                'INSERT INTO kategoria (nev, hivatkozas) VALUES (?, ?)',
                [category.nev, category.hivatkozas]
            );
            console.log(`"${category.nev}" kategória hozzáadva.`);
        }
        
        console.log('Összes kategória sikeresen hozzáadva!');
    } catch (error) {
        console.error('Hiba a kategóriák hozzáadása során:', error);
    } finally {
        await connection.end();
    }
}

addCategories();

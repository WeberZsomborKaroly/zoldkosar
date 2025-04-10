const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'webshop_project',
    port: 3306
};

async function checkProductCategories() {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
        // Ellenőrizzük a termekek tábla szerkezetét
        console.log('A termekek tábla szerkezete:');
        const [termekStruktura] = await connection.query('DESCRIBE termekek');
        console.log(termekStruktura);
        
        // Lekérdezzük az összes kategóriát
        console.log('\nKategóriák:');
        const [kategoriak] = await connection.query('SELECT * FROM kategoriak');
        const kategoriaMap = {};
        kategoriak.forEach(kat => {
            kategoriaMap[kat.id] = kat.nev;
            console.log(`${kat.id}: ${kat.nev}`);
        });
        
        // Lekérdezzük az összes terméket kategóriával együtt
        console.log('\nTermékek kategóriákkal:');
        const [termekek] = await connection.query(`
            SELECT t.id, t.nev, t.kategoria_id, k.nev as kategoria_nev
            FROM termekek t
            LEFT JOIN kategoriak k ON t.kategoria_id = k.id
            ORDER BY t.nev
        `);
        
        termekek.forEach(termek => {
            console.log(`${termek.id}: ${termek.nev} - Kategória: ${termek.kategoria_id} (${termek.kategoria_nev || 'Nincs kategória'})`);
        });
        
        // Ellenőrizzük a problémás kategóriákat
        console.log('\nProblémás kategóriák ellenőrzése:');
        
        // 18+ kategória (id: 3)
        console.log('\n18+ kategóriába tartozó termékek:');
        const [tizennyolcPlusz] = await connection.query('SELECT * FROM termekek WHERE kategoria_id = 3');
        tizennyolcPlusz.forEach(termek => {
            console.log(`${termek.id}: ${termek.nev}`);
        });
        
        // Édességek kategória (id: 2)
        console.log('\nÉdességek kategóriába tartozó termékek:');
        const [edessegek] = await connection.query('SELECT * FROM termekek WHERE kategoria_id = 2');
        edessegek.forEach(termek => {
            console.log(`${termek.id}: ${termek.nev}`);
        });
        
        // Pékáruk kategória (id: 6)
        console.log('\nPékáruk kategóriába tartozó termékek:');
        const [pekaruk] = await connection.query('SELECT * FROM termekek WHERE kategoria_id = 6');
        pekaruk.forEach(termek => {
            console.log(`${termek.id}: ${termek.nev}`);
        });
        
        // Zöldségek kategória (id: 7)
        console.log('\nZöldségek kategóriába tartozó termékek:');
        const [zoldsegek] = await connection.query('SELECT * FROM termekek WHERE kategoria_id = 7');
        zoldsegek.forEach(termek => {
            console.log(`${termek.id}: ${termek.nev}`);
        });
        
        // Tejtermékek kategória (id: 5)
        console.log('\nTejtermékek kategóriába tartozó termékek:');
        const [tejtermekek] = await connection.query('SELECT * FROM termekek WHERE kategoria_id = 5');
        tejtermekek.forEach(termek => {
            console.log(`${termek.id}: ${termek.nev}`);
        });
        
    } catch (error) {
        console.error('Hiba a termékek és kategóriák ellenőrzésekor:', error);
    } finally {
        await connection.end();
    }
}

checkProductCategories();

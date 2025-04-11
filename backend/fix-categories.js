const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'webshop_project',
    port: 3306
};

async function fixCategories() {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
        console.log('Kategória javítások megkezdése...');
        
        
        const javitasok = [
            // 18+ kategória - csak a Chivas Regal marad
            { id: 30, kategoria_id: 4 }, // Csirkemell filé -> Étel
            { id: 31, kategoria_id: 4 }, // Sertéskaraj -> Étel
            { id: 32, kategoria_id: 4 }, // Darált hús -> Étel
            { id: 33, kategoria_id: 4 }, // Csirkecomb -> Étel
            { id: 34, kategoria_id: 4 }, // Sertésoldalas -> Étel
            { id: 35, kategoria_id: 4 }, // Pulykamell -> Étel
            { id: 36, kategoria_id: 4 }, // Marha hátszín -> Étel
            { id: 37, kategoria_id: 4 }, // Csirkeszárny -> Étel
            { id: 38, kategoria_id: 4 }, // Kolbász -> Étel
            { id: 39, kategoria_id: 4 }, // Szalámi -> Étel
            
            
            { id: 20, kategoria_id: 6 }, // Kenyér fehér -> Pékáruk
            { id: 21, kategoria_id: 6 }, // Zsemle -> Pékáruk
            { id: 22, kategoria_id: 6 }, // Kifli -> Pékáruk
            { id: 23, kategoria_id: 6 }, // Kakaós csiga -> Pékáruk
            { id: 24, kategoria_id: 6 }, // Túrós batyu -> Pékáruk
            { id: 25, kategoria_id: 6 }, // Pogácsa -> Pékáruk
            { id: 26, kategoria_id: 6 }, // Croissant -> Pékáruk
            { id: 27, kategoria_id: 6 }, // Bagett -> Pékáruk
            { id: 28, kategoria_id: 6 }, // Rozskenyér -> Pékáruk
            { id: 29, kategoria_id: 6 }, // Briós -> Pékáruk
            
            
            { id: 54, kategoria_id: 5 }, // Vaj -> Tejtermékek
            
            
            { id: 40, kategoria_id: 7 }, // Burgonya -> Zöldségek
            { id: 41, kategoria_id: 7 }, // Hagyma -> Zöldségek
            { id: 42, kategoria_id: 7 }, // Répa -> Zöldségek
            { id: 43, kategoria_id: 7 }, // Uborka -> Zöldségek
            { id: 44, kategoria_id: 7 }, // Paprika -> Zöldségek
            { id: 45, kategoria_id: 7 }, // Cukkini -> Zöldségek
            { id: 46, kategoria_id: 7 }, // Padlizsán -> Zöldségek
            { id: 47, kategoria_id: 7 }, // Fokhagyma -> Zöldségek
            { id: 48, kategoria_id: 7 }, // Saláta -> Zöldségek
            { id: 49, kategoria_id: 7 }, // Brokkoli -> Zöldségek
            
            
            { id: 2, kategoria_id: 8 }, // Banán -> Gyümölcsök
        ];
        
       
        for (const javitas of javitasok) {
            await connection.query(
                'UPDATE termekek SET kategoria_id = ? WHERE id = ?',
                [javitas.kategoria_id, javitas.id]
            );
            console.log(`Termék ${javitas.id} kategóriája frissítve: ${javitas.kategoria_id}`);
        }
        
        console.log('\nKategória javítások befejezve!');
        
        
        console.log('\nEllenőrzés - kategóriák termékszáma:');
        
        const kategoriak = [
            { id: 1, nev: 'Háztartási' },
            { id: 2, nev: 'Édességek' },
            { id: 3, nev: '18+' },
            { id: 4, nev: 'Étel' },
            { id: 5, nev: 'Tejtermékek' },
            { id: 6, nev: 'Pékáruk' },
            { id: 7, nev: 'Zöldségek' },
            { id: 8, nev: 'Gyümölcsök' }
        ];
        
        for (const kategoria of kategoriak) {
            const [termekek] = await connection.query(
                'SELECT COUNT(*) as count FROM termekek WHERE kategoria_id = ?',
                [kategoria.id]
            );
            console.log(`${kategoria.nev}: ${termekek[0].count} termék`);
        }
        
    } catch (error) {
        console.error('Hiba a kategóriák javításakor:', error);
    } finally {
        await connection.end();
    }
}

fixCategories();

const db = require('./models');

async function createSampleCoupons() {
    try {
        
        await db.Kupon.destroy({ where: {} });
        console.log('A meglévő kuponok törölve.');
        
        
        const kuponok = [
            {
                kod: 'UJVASARLO',
                kedvezmeny_tipus: 'szazalek',
                ertek: 10,
                minimum_osszeg: 5000,
                felhasznalhato: null,
                felhasznalva: 0,
                aktiv: true,
                ervenyes_kezdete: new Date(),
                ervenyes_vege: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) // 1 év múlva jár le
            },
            {
                kod: 'NYAR2024',
                kedvezmeny_tipus: 'szazalek',
                ertek: 15,
                minimum_osszeg: 10000,
                felhasznalhato: null,
                felhasznalva: 0,
                aktiv: true,
                ervenyes_kezdete: new Date(),
                ervenyes_vege: new Date('2024-08-31')
            },
            {
                kod: 'FIX1000',
                kedvezmeny_tipus: 'fix',
                ertek: 1000,
                minimum_osszeg: 5000,
                felhasznalhato: null,
                felhasznalva: 0,
                aktiv: true,
                ervenyes_kezdete: new Date(),
                ervenyes_vege: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            },
            {
                kod: 'FIX2000',
                kedvezmeny_tipus: 'fix',
                ertek: 2000,
                minimum_osszeg: 10000,
                felhasznalhato: null,
                felhasznalva: 0,
                aktiv: true,
                ervenyes_kezdete: new Date(),
                ervenyes_vege: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            },
            {
                kod: 'TESZT20',
                kedvezmeny_tipus: 'szazalek',
                ertek: 20,
                minimum_osszeg: 0,
                felhasznalhato: 10,
                felhasznalva: 0,
                aktiv: true,
                ervenyes_kezdete: new Date(),
                ervenyes_vege: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            }
        ];
        
        // Kuponok mentése az adatbázisba
        await db.Kupon.bulkCreate(kuponok);
        console.log('Minta kuponok sikeresen létrehozva!');
        
        // Ellenőrizzük, hogy tényleg létrejöttek-e a kuponok
        const count = await db.Kupon.count();
        console.log(`A kuponok táblában ${count} rekord található.`);
    } catch (error) {
        console.error('Hiba történt a minta kuponok létrehozásakor:', error);
    } finally {
       
        await db.sequelize.close();
    }
}

createSampleCoupons();

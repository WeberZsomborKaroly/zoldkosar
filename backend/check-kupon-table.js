const db = require('./models');

async function checkKuponTable() {
    try {
        // Próbáljuk meg szinkronizálni a Kupon modellt
        await db.Kupon.sync({ alter: false });
        console.log('A kuponok tábla létezik vagy sikeresen létrejött.');
        
        // Ellenőrizzük, hogy van-e adat a táblában
        const count = await db.Kupon.count();
        console.log(`A kuponok táblában ${count} rekord található.`);
    } catch (error) {
        console.error('Hiba történt a kuponok tábla ellenőrzésekor:', error);
    } finally {
        // Zárjuk le a kapcsolatot
        await db.sequelize.close();
    }
}

checkKuponTable();

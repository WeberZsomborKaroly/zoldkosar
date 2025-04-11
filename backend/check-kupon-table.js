const db = require('./models');

async function checkKuponTable() {
    try {
        
        await db.Kupon.sync({ alter: false });
        console.log('A kuponok tábla létezik vagy sikeresen létrejött.');
        
        
        const count = await db.Kupon.count();
        console.log(`A kuponok táblában ${count} rekord található.`);
    } catch (error) {
        console.error('Hiba történt a kuponok tábla ellenőrzésekor:', error);
    } finally {
        
        await db.sequelize.close();
    }
}

checkKuponTable();

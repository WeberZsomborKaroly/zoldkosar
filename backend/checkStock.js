const db = require('./models');
const Termek = db.Termek;

async function main() {
    try {
        await db.sequelize.authenticate();
        console.log('Kapcsolat sikeres!');
        
        const termekek = await Termek.findAll();
        console.log('Termékek és készletek:');
        termekek.forEach(t => console.log(`${t.id}: ${t.nev} - Készlet: ${t.keszlet}`));
    } catch (error) {
        console.error('Hiba:', error);
    } finally {
        process.exit(0);
    }
}

main();

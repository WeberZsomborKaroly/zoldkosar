const db = require('./models');
const Kategoria = db.Kategoria;

async function testSequelize() {
    try {
        console.log('Kategóriák lekérdezése a Sequelize modellen keresztül:');
        const kategoriak = await Kategoria.findAll({
            order: [['nev', 'ASC']]
        });
        
        console.log(JSON.stringify(kategoriak, null, 2));
        console.log(`Talált kategóriák száma: ${kategoriak.length}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Hiba a Sequelize lekérdezés során:', error);
        process.exit(1);
    }
}

testSequelize();

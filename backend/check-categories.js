const db = require('./models');
const Kategoria = db.Kategoria;

async function checkCategories() {
    try {
        console.log("Kapcsolódás az adatbázishoz...");
        await db.sequelize.authenticate();
        console.log("Kapcsolat sikeres!");
        
        console.log("Kategóriák lekérdezése...");
        
        
        const categories = await Kategoria.findAll();
        
        console.log(`Összesen ${categories.length} kategória található az adatbázisban.`);
        console.log("Kategóriák listája:");
        
        categories.forEach(category => {
            console.log(`ID: ${category.id}, Név: ${category.nev}`);
        });
        
        console.log("Kategóriák lekérdezése befejeződött!");
    } catch (error) {
        console.error("Hiba a kategóriák lekérdezésekor:", error);
    } finally {
        process.exit(0);
    }
}


checkCategories();

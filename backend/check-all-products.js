const db = require('./models');
const Termek = db.Termek;

async function checkAllProducts() {
    try {
        console.log("Kapcsolódás az adatbázishoz...");
        await db.sequelize.authenticate();
        console.log("Kapcsolat sikeres!");
        
        console.log("Összes termék lekérdezése...");
        
        
        const products = await Termek.findAll();
        
        console.log(`Összesen ${products.length} termék található az adatbázisban.`);
        console.log("Termékek listája:");
        
        products.forEach(product => {
            console.log(`ID: ${product.id}, Név: ${product.nev}, Kép: ${product.kep}, Kategória: ${product.kategoria_id}`);
        });
        
        console.log("Termékek lekérdezése befejeződött!");
    } catch (error) {
        console.error("Hiba a termékek lekérdezésekor:", error);
    } finally {
        process.exit(0);
    }
}


checkAllProducts();

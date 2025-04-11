const db = require('./models');
const Termek = db.Termek;

async function checkFoodProducts() {
    try {
        console.log("Kapcsolódás az adatbázishoz...");
        await db.sequelize.authenticate();
        console.log("Kapcsolat sikeres!");
        
        console.log("Ételek lekérdezése...");
        
        
        const foodProducts = await Termek.findAll({ 
            where: { 
                kategoria_id: 4 
            } 
        });
        
        console.log(`Összesen ${foodProducts.length} étel található az adatbázisban.`);
        console.log("Ételek listája:");
        
        foodProducts.forEach(product => {
            console.log(`ID: ${product.id}, Név: ${product.nev}, Kép: ${product.kep}`);
        });
        
        console.log("Ételek lekérdezése befejeződött!");
    } catch (error) {
        console.error("Hiba az ételek lekérdezésekor:", error);
    } finally {
        process.exit(0);
    }
}


checkFoodProducts();

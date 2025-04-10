const db = require('./models');
const Termek = db.Termek;

async function checkFruitProducts() {
    try {
        console.log("Kapcsolódás az adatbázishoz...");
        await db.sequelize.authenticate();
        console.log("Kapcsolat sikeres!");
        
        console.log("Gyümölcsök lekérdezése...");
        
        // Lekérjük az összes gyümölcsöt (kategória 8)
        const fruitProducts = await Termek.findAll({ 
            where: { 
                kategoria_id: 8 
            } 
        });
        
        console.log(`Összesen ${fruitProducts.length} gyümölcs található az adatbázisban.`);
        console.log("Gyümölcsök listája:");
        
        fruitProducts.forEach(product => {
            console.log(`ID: ${product.id}, Név: ${product.nev}, Kép: ${product.kep}`);
        });
        
        console.log("Gyümölcsök lekérdezése befejeződött!");
    } catch (error) {
        console.error("Hiba a gyümölcsök lekérdezésekor:", error);
    } finally {
        process.exit(0);
    }
}

// Futtatás
checkFruitProducts();

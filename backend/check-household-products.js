const db = require('./models');
const Termek = db.Termek;

async function checkHouseholdProducts() {
    try {
        console.log("Kapcsolódás az adatbázishoz...");
        await db.sequelize.authenticate();
        console.log("Kapcsolat sikeres!");
        
        console.log("Háztartási termékek lekérdezése...");
        
        
        const householdProducts = await Termek.findAll({ 
            where: { 
                kategoria_id: 1 
            } 
        });
        
        console.log(`Összesen ${householdProducts.length} háztartási termék található az adatbázisban.`);
        console.log("Háztartási termékek listája:");
        
        householdProducts.forEach(product => {
            console.log(`ID: ${product.id}, Név: ${product.nev}, Kép: ${product.kep}`);
        });
        
        console.log("Háztartási termékek lekérdezése befejeződött!");
    } catch (error) {
        console.error("Hiba a háztartási termékek lekérdezésekor:", error);
    } finally {
        process.exit(0);
    }
}


checkHouseholdProducts();

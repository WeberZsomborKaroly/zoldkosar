const db = require('./models');
const Termek = db.Termek;
const Kategoria = db.Kategoria;

async function checkVegetableProducts() {
    try {
        console.log("Kapcsolódás az adatbázishoz...");
        await db.sequelize.authenticate();
        console.log("Kapcsolat sikeres!");
        
        // Get the Zöldségek category ID
        const vegetableCategory = await Kategoria.findOne({ where: { nev: 'Zöldségek' } });
        
        if (!vegetableCategory) {
            console.error("A 'Zöldségek' kategória nem található!");
            return;
        }
        
        const vegetableCategoryId = vegetableCategory.id;
        console.log(`Zöldségek kategória ID: ${vegetableCategoryId}`);
        
        console.log("Zöldségek lekérdezése...");
        
        // Get all products in the Zöldségek category
        const products = await Termek.findAll({ 
            where: { kategoria_id: vegetableCategoryId },
            order: [['id', 'ASC']]
        });
        
        console.log(`Összesen ${products.length} zöldség termék található az adatbázisban.`);
        console.log("Zöldségek listája:");
        
        products.forEach(product => {
            console.log(`ID: ${product.id}, Név: ${product.nev}, Kép: ${product.kep}`);
        });
        
        console.log("Zöldségek lekérdezése befejeződött!");
    } catch (error) {
        console.error("Hiba a termékek lekérdezésekor:", error);
    } finally {
        process.exit(0);
    }
}

// Run the function
checkVegetableProducts();

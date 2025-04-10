const db = require('./models');
const Termek = db.Termek;
const Kategoria = db.Kategoria;

async function checkDairyProducts() {
    try {
        console.log("Kapcsolódás az adatbázishoz...");
        await db.sequelize.authenticate();
        console.log("Kapcsolat sikeres!");
        
        // Get the Tejtermékek category ID
        const dairyCategory = await Kategoria.findOne({ where: { nev: 'Tejtermékek' } });
        
        if (!dairyCategory) {
            console.error("A 'Tejtermékek' kategória nem található!");
            return;
        }
        
        const dairyCategoryId = dairyCategory.id;
        console.log(`Tejtermékek kategória ID: ${dairyCategoryId}`);
        
        console.log("Tejtermékek lekérdezése...");
        
        // Get all products in the Tejtermékek category
        const products = await Termek.findAll({ 
            where: { kategoria_id: dairyCategoryId },
            order: [['id', 'ASC']]
        });
        
        console.log(`Összesen ${products.length} tejtermék található az adatbázisban.`);
        console.log("Tejtermékek listája:");
        
        products.forEach(product => {
            console.log(`ID: ${product.id}, Név: ${product.nev}, Kép: ${product.kep}`);
        });
        
        console.log("Tejtermékek lekérdezése befejeződött!");
    } catch (error) {
        console.error("Hiba a termékek lekérdezésekor:", error);
    } finally {
        process.exit(0);
    }
}

// Run the function
checkDairyProducts();

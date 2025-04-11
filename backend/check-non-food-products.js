const db = require('./models');
const Termek = db.Termek;
const Kategoria = db.Kategoria;

async function checkNonFoodProducts() {
    try {
        console.log("Kapcsolódás az adatbázishoz...");
        await db.sequelize.authenticate();
        console.log("Kapcsolat sikeres!");
        
        
        const nonFoodCategory = await Kategoria.findOne({ where: { nev: 'Non-food' } });
        
        if (!nonFoodCategory) {
            console.error("A 'Non-food' kategória nem található!");
            return;
        }
        
        const nonFoodCategoryId = nonFoodCategory.id;
        console.log(`Non-food kategória ID: ${nonFoodCategoryId}`);
        
        console.log("Non-food termékek lekérdezése...");
        
       
        const products = await Termek.findAll({ 
            where: { kategoria_id: nonFoodCategoryId },
            order: [['id', 'ASC']]
        });
        
        console.log(`Összesen ${products.length} non-food termék található az adatbázisban.`);
        console.log("Non-food termékek listája:");
        
        products.forEach(product => {
            console.log(`ID: ${product.id}, Név: ${product.nev}, Kép: ${product.kep}`);
        });
        
        console.log("Non-food termékek lekérdezése befejeződött!");
    } catch (error) {
        console.error("Hiba a termékek lekérdezésekor:", error);
    } finally {
        process.exit(0);
    }
}


checkNonFoodProducts();

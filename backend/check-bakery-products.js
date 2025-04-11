const db = require('./models');
const Termek = db.Termek;
const Kategoria = db.Kategoria;

async function checkBakeryProducts() {
    try {
        console.log("Kapcsolódás az adatbázishoz...");
        await db.sequelize.authenticate();
        console.log("Kapcsolat sikeres!");
        
      
        const bakeryCategory = await Kategoria.findOne({ where: { nev: 'Pékáruk' } });
        
        if (!bakeryCategory) {
            console.error("A 'Pékáruk' kategória nem található!");
            return;
        }
        
        const bakeryCategoryId = bakeryCategory.id;
        console.log(`Pékáruk kategória ID: ${bakeryCategoryId}`);
        
        console.log("Pékáruk termékek lekérdezése...");
        
        
        const products = await Termek.findAll({ 
            where: { kategoria_id: bakeryCategoryId },
            order: [['id', 'ASC']]
        });
        
        console.log(`Összesen ${products.length} pékáru termék található az adatbázisban.`);
        console.log("Pékáruk termékek listája:");
        
        products.forEach(product => {
            console.log(`ID: ${product.id}, Név: ${product.nev}, Kép: ${product.kep}`);
        });
        
        console.log("Pékáruk termékek lekérdezése befejeződött!");
    } catch (error) {
        console.error("Hiba a termékek lekérdezésekor:", error);
    } finally {
        process.exit(0);
    }
}


checkBakeryProducts();

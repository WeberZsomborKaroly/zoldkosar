const db = require('./models');
const Termek = db.Termek;

// Milk products to update
const milkProducts = [
    { 
        nev: "Friss tej", 
        kep: "tej1l.png"
    },
    { 
        nev: "Tej 1l", 
        kep: "tej1l.png"
    }
];

async function updateMilkProducts() {
    try {
        console.log("Kapcsolódás az adatbázishoz...");
        await db.sequelize.authenticate();
        console.log("Kapcsolat sikeres!");
        
        console.log("Tej termékek frissítése...");
        let updatedCount = 0;
        
        for (const product of milkProducts) {
            // Keressük meg a terméket név alapján
            const dbProduct = await Termek.findOne({ where: { nev: product.nev } });
            
            if (dbProduct) {
                // Frissítsük a kép útvonalát
                await dbProduct.update({ kep: product.kep });
                console.log(`Termék kép frissítve: ${product.nev} -> ${product.kep}`);
                updatedCount++;
            } else {
                console.log(`A termék nem található: ${product.nev}`);
            }
        }
        
        console.log(`Összesen ${updatedCount} termék képe frissítve.`);
        console.log("Képek frissítése befejeződött!");
    } catch (error) {
        console.error("Hiba a képek frissítésekor:", error);
    } finally {
        process.exit(0);
    }
}

// Futtatás
updateMilkProducts();

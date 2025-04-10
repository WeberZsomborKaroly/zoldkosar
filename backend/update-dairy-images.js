const db = require('./models');
const Termek = db.Termek;

// Dairy products with updated image paths
const dairyProducts = [
    { 
        nev: "Sajt 200g", 
        kep: "sajt200g.png"
    },
    { 
        nev: "Túró 250g", 
        kep: "turo250g.png"
    },
    { 
        nev: "Tejföl 330g", 
        kep: "tejfol330g.png"
    },
    { 
        nev: "Vaj 100g", 
        kep: "vaj100g.png"
    },
    { 
        nev: "Joghurt 150g", 
        kep: "joghurt150g.png"
    },
    { 
        nev: "Kefir 175g", 
        kep: "kefir175g.png"
    },
    { 
        nev: "Mozzarella 125g", 
        kep: "mozzarella125g.png"
    },
    { 
        nev: "Mascarpone 250g", 
        kep: "mascarpone250g.png"
    },
    { 
        nev: "Parmezán 100g", 
        kep: "parmezan.png"
    }
];

async function updateDairyImages() {
    try {
        console.log("Kapcsolódás az adatbázishoz...");
        await db.sequelize.authenticate();
        console.log("Kapcsolat sikeres!");
        
        console.log("Tejtermék képek frissítése...");
        let updatedCount = 0;
        
        for (const product of dairyProducts) {
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
updateDairyImages();

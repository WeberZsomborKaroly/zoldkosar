const db = require('./models');
const Termek = db.Termek;

// Vegetable products with updated image paths
const vegetableProducts = [
    { 
        nev: "Burgonya 1kg", 
        kep: "burgonya.png"
    },
    { 
        nev: "Hagyma 1kg", 
        kep: "hagyma.png"
    },
    { 
        nev: "Répa 1kg", 
        kep: "repa.png"
    },
    { 
        nev: "Uborka 1kg", 
        kep: "uborka.png"
    },
    { 
        nev: "Paprika 1kg", 
        kep: "paprika.png"
    },
    { 
        nev: "Cukkini 1kg", 
        kep: "cukkini.png"
    },
    { 
        nev: "Padlizsán 1kg", 
        kep: "padlizsan.png"
    },
    { 
        nev: "Fokhagyma 100g", 
        kep: "fokhagyma.png"
    },
    { 
        nev: "Saláta", 
        kep: "salata.png"
    },
    { 
        nev: "Brokkoli 500g", 
        kep: "brokkoli.png"
    },
    {
        nev: "Paradicsom",
        kep: "paradicsom.png"
    }
];

async function updateVegetableImages() {
    try {
        console.log("Kapcsolódás az adatbázishoz...");
        await db.sequelize.authenticate();
        console.log("Kapcsolat sikeres!");
        
        console.log("Zöldség termék képek frissítése...");
        let updatedCount = 0;
        
        for (const product of vegetableProducts) {
            // Keressük meg a terméket név alapján
            const dbProduct = await Termek.findOne({ 
                where: { 
                    nev: product.nev 
                } 
            });
            
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
updateVegetableImages();

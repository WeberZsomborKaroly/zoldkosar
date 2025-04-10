const db = require('./models');
const Termek = db.Termek;

// Bakery products with updated image paths
const bakeryProducts = [
    { 
        nev: "Zsemle", 
        kep: "zsemle.png"
    },
    { 
        nev: "Kifli", 
        kep: "kifli.png"
    },
    { 
        nev: "Kakaós csiga", 
        kep: "kakaoscsiga.png"
    },
    { 
        nev: "Túrós batyu", 
        kep: "turosbatyu.png"
    },
    { 
        nev: "Pogácsa", 
        kep: "pogacsa.png"
    },
    { 
        nev: "Croissant", 
        kep: "croissant.png"
    },
    { 
        nev: "Bagett", 
        kep: "bagett.png"
    },
    { 
        nev: "Rozskenyér", 
        kep: "rozskenyer.png"
    },
    { 
        nev: "Briós", 
        kep: "brios.png"
    }
];

async function updateBakeryImages() {
    try {
        console.log("Kapcsolódás az adatbázishoz...");
        await db.sequelize.authenticate();
        console.log("Kapcsolat sikeres!");
        
        console.log("Pékáru termék képek frissítése...");
        let updatedCount = 0;
        
        for (const product of bakeryProducts) {
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
updateBakeryImages();

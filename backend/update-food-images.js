const db = require('./models');
const Termek = db.Termek;

// Food products with updated image paths
const etelek = [
    { 
        nev: "Csirkecomb 1kg", 
        kep: "csirkecombkg.png"
    },
    { 
        nev: "Csirkeszárny 1kg", 
        kep: "csirkeszarnykg.png"
    },
    { 
        nev: "Darált hús 500g", 
        kep: "daralthus500g.png"
    },
    { 
        nev: "Kolbász 200g", 
        kep: "kolbasz200g.png"
    },
    { 
        nev: "Marha hátszín 1kg", 
        kep: "marhahatszinkg.png"
    },
    { 
        nev: "Pulykamell 1kg", 
        kep: "pulykamellkg.png"
    },
    { 
        nev: "Sertéskaraj 1kg", 
        kep: "serteskarajkg.png"
    },
    { 
        nev: "Sertésoldalas 1kg", 
        kep: "sertesoldalaskg.png"
    },
    { 
        nev: "Szalámi 100g", 
        kep: "szalami100g.png"
    }
];

async function updateFoodImages() {
    try {
        console.log("Kapcsolódás az adatbázishoz...");
        await db.sequelize.authenticate();
        console.log("Kapcsolat sikeres!");
        
        console.log("Étel képek frissítése...");
        let updatedCount = 0;
        
        for (const etel of etelek) {
            // Keressük meg a terméket név alapján
            const product = await Termek.findOne({ where: { nev: etel.nev } });
            
            if (product) {
                // Frissítsük a kép útvonalát
                await product.update({ kep: etel.kep });
                console.log(`Termék kép frissítve: ${etel.nev} -> ${etel.kep}`);
                updatedCount++;
            } else {
                console.log(`A termék nem található: ${etel.nev}`);
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
updateFoodImages();

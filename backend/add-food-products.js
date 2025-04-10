const db = require('./models');
const Termek = db.Termek;

// Food products to add - matching the existing images in the etel folder
const etelek = [
    { 
        nev: "Csirkecomb 1kg", 
        leiras: "Friss csirkecomb", 
        ar: 1500, 
        keszlet: 35, 
        kategoria_id: 4, // Category 4 is "Étel"
        kep: "csirkecombkg.png",
        aktiv: 1
    },
    { 
        nev: "Csirkeszárny 1kg", 
        leiras: "Friss csirkeszárny", 
        ar: 1300, 
        keszlet: 40, 
        kategoria_id: 4,
        kep: "csirkeszarnykg.png",
        aktiv: 1
    },
    { 
        nev: "Darált hús 500g", 
        leiras: "Sertés darált hús", 
        ar: 1200, 
        keszlet: 20, 
        kategoria_id: 4,
        kep: "daralthus500g.png",
        aktiv: 1
    },
    { 
        nev: "Kolbász 200g", 
        leiras: "Házi kolbász", 
        ar: 900, 
        keszlet: 30, 
        kategoria_id: 4,
        kep: "kolbasz200g.png",
        aktiv: 1
    },
    { 
        nev: "Marha hátszín 1kg", 
        leiras: "Prémium marha hátszín", 
        ar: 5000, 
        keszlet: 10, 
        kategoria_id: 4,
        kep: "marhahatszinkg.png",
        aktiv: 1
    },
    { 
        nev: "Pulykamell 1kg", 
        leiras: "Friss pulykamell", 
        ar: 2000, 
        keszlet: 20, 
        kategoria_id: 4,
        kep: "pulykamellkg.png",
        aktiv: 1
    },
    { 
        nev: "Sertéskaraj 1kg", 
        leiras: "Friss sertéskaraj", 
        ar: 2200, 
        keszlet: 25, 
        kategoria_id: 4,
        kep: "serteskarajkg.png",
        aktiv: 1
    },
    { 
        nev: "Sertésoldalas 1kg", 
        leiras: "Friss sertésoldalas", 
        ar: 1900, 
        keszlet: 15, 
        kategoria_id: 4,
        kep: "sertesoldalaskg.png",
        aktiv: 1
    },
    { 
        nev: "Szalámi 100g", 
        leiras: "Téliszalámi", 
        ar: 800, 
        keszlet: 25, 
        kategoria_id: 4,
        kep: "szalami100g.png",
        aktiv: 1
    }
];

async function addFoodProducts() {
    try {
        console.log("Kapcsolódás az adatbázishoz...");
        await db.sequelize.authenticate();
        console.log("Kapcsolat sikeres!");
        
        console.log("Ételek hozzáadása...");
        let addedCount = 0;
        
        for (const etel of etelek) {
            // Ellenőrizzük, hogy létezik-e már ilyen nevű termék
            const existingProduct = await Termek.findOne({ where: { nev: etel.nev } });
            
            if (!existingProduct) {
                await Termek.create(etel);
                console.log(`Étel hozzáadva: ${etel.nev}`);
                addedCount++;
            } else {
                console.log(`A termék már létezik: ${etel.nev}`);
            }
        }
        
        console.log(`Összesen ${addedCount} új étel került hozzáadásra.`);
        console.log("Ételek hozzáadása befejeződött!");
    } catch (error) {
        console.error("Hiba az ételek hozzáadásakor:", error);
    } finally {
        process.exit(0);
    }
}

// Futtatás
addFoodProducts();

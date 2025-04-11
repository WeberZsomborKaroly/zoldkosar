const db = require('./models');
const Termek = db.Termek;


const gyumolcsok = [
    { 
        nev: "Ananász", 
        leiras: "Friss, édes ananász", 
        ar: 890, 
        keszlet: 25, 
        kategoria_id: 8, 
        kep: "ananasz.png",
        aktiv: 1
    },
    { 
        nev: "Citrom", 
        leiras: "Friss, lédús citrom", 
        ar: 590, 
        keszlet: 40, 
        kategoria_id: 8,
        kep: "citrom.png",
        aktiv: 1
    },
    { 
        nev: "Szeder", 
        leiras: "Friss, édes szeder", 
        ar: 1290, 
        keszlet: 15, 
        kategoria_id: 8,
        kep: "szeder-scaled.jpg",
        aktiv: 1
    },
    { 
        nev: "Narancs", 
        leiras: "Friss, lédús narancs", 
        ar: 690, 
        keszlet: 35, 
        kategoria_id: 8,
        kep: "narancs.png",
        aktiv: 1
    }
];

async function addFruitProducts() {
    try {
        console.log("Kapcsolódás az adatbázishoz...");
        await db.sequelize.authenticate();
        console.log("Kapcsolat sikeres!");
        
        console.log("Gyümölcsök hozzáadása...");
        let addedCount = 0;
        
        for (const gyumolcs of gyumolcsok) {
            // Ellenőrizzük, hogy létezik-e már ilyen nevű termék
            const existingProduct = await Termek.findOne({ where: { nev: gyumolcs.nev } });
            
            if (!existingProduct) {
                await Termek.create(gyumolcs);
                console.log(`Gyümölcs hozzáadva: ${gyumolcs.nev}`);
                addedCount++;
            } else {
                console.log(`A termék már létezik: ${gyumolcs.nev}`);
            }
        }
        
        console.log(`Összesen ${addedCount} új gyümölcs került hozzáadásra.`);
        console.log("Gyümölcsök hozzáadása befejeződött!");
    } catch (error) {
        console.error("Hiba a gyümölcsök hozzáadásakor:", error);
    } finally {
        process.exit(0);
    }
}

// Futtatás
addFruitProducts();

const db = require('./models');
const Termek = db.Termek;

// Sweet products to add - matching the existing images in the edessegek folder
const edessegek = [
    { 
        nev: "Balaton étcsokoládés szelet", 
        leiras: "Klasszikus étcsokoládés Balaton szelet", 
        ar: 320, 
        keszlet: 75, 
        kategoria_id: 2, // Assuming 2 is the category for sweets
        kep: "balatonetcsokis.png",
        aktiv: 1
    },
    { 
        nev: "Haribo gumicukor", 
        leiras: "Haribo gumicukor válogatás", 
        ar: 450, 
        keszlet: 60, 
        kategoria_id: 2,
        kep: "haribo.png",
        aktiv: 1
    },
    { 
        nev: "Kinder Bueno", 
        leiras: "Mogyorós krémmel töltött ostya tejcsokoládé bevonattal", 
        ar: 380, 
        keszlet: 90, 
        kategoria_id: 2,
        kep: "kinder bueno.png",
        aktiv: 1
    },
    { 
        nev: "Sport szelet", 
        leiras: "Klasszikus rumos ízű Sport szelet", 
        ar: 250, 
        keszlet: 85, 
        kategoria_id: 2,
        kep: "sportszelet.png",
        aktiv: 1
    }
];

async function addSweetProducts() {
    try {
        console.log("Kapcsolódás az adatbázishoz...");
        await db.sequelize.authenticate();
        console.log("Kapcsolat sikeres!");
        
        console.log("Édességek hozzáadása...");
        let addedCount = 0;
        
        for (const edesseg of edessegek) {
            // Ellenőrizzük, hogy létezik-e már ilyen nevű termék
            const existingProduct = await Termek.findOne({ where: { nev: edesseg.nev } });
            
            if (!existingProduct) {
                await Termek.create(edesseg);
                console.log(`Édesség hozzáadva: ${edesseg.nev}`);
                addedCount++;
            } else {
                console.log(`A termék már létezik: ${edesseg.nev}`);
            }
        }
        
        console.log(`Összesen ${addedCount} új édesség került hozzáadásra.`);
        console.log("Édességek hozzáadása befejeződött!");
    } catch (error) {
        console.error("Hiba az édességek hozzáadásakor:", error);
    } finally {
        process.exit(0);
    }
}

// Futtatás
addSweetProducts();

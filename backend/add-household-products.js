const db = require('./models');
const Termek = db.Termek;


const haztartasi = [
    { 
        nev: "Almalé 1L", 
        leiras: "100% gyümölcstartalmú almalé", 
        ar: 550, 
        keszlet: 60, 
        kategoria_id: 1, 
        kep: "almale1l.png",
        aktiv: 1
    },
    { 
        nev: "Ásványvíz 0.5L", 
        leiras: "Szénsavmentes ásványvíz", 
        ar: 150, 
        keszlet: 200, 
        kategoria_id: 1,
        kep: "asvanyviz05l.png",
        aktiv: 1
    },
    { 
        nev: "Ásványvíz 1.5L", 
        leiras: "Szénsavmentes ásványvíz", 
        ar: 250, 
        keszlet: 150, 
        kategoria_id: 1,
        kep: "asvanyviz15l.png",
        aktiv: 1
    },
    { 
        nev: "Coca-Cola 0.5L", 
        leiras: "Szénsavas üdítőital", 
        ar: 350, 
        keszlet: 120, 
        kategoria_id: 1,
        kep: "cocacola05l.png",
        aktiv: 1
    },
    { 
        nev: "Fanta 0.5L", 
        leiras: "Narancs ízű szénsavas üdítőital", 
        ar: 350, 
        keszlet: 100, 
        kategoria_id: 1,
        kep: "fanta05l.png",
        aktiv: 1
    },
    { 
        nev: "Narancslé 1L", 
        leiras: "100% gyümölcstartalmú narancslé", 
        ar: 600, 
        keszlet: 50, 
        kategoria_id: 1,
        kep: "narancsle1l.png",
        aktiv: 1
    },
    { 
        nev: "Sprite 0.5L", 
        leiras: "Citrom ízű szénsavas üdítőital", 
        ar: 350, 
        keszlet: 90, 
        kategoria_id: 1,
        kep: "sprite05l.png",
        aktiv: 1
    }
];

async function addHouseholdProducts() {
    try {
        console.log("Kapcsolódás az adatbázishoz...");
        await db.sequelize.authenticate();
        console.log("Kapcsolat sikeres!");
        
        console.log("Háztartási termékek hozzáadása...");
        let addedCount = 0;
        
        for (const termek of haztartasi) {
            // Ellenőrizzük, hogy létezik-e már ilyen nevű termék
            const existingProduct = await Termek.findOne({ where: { nev: termek.nev } });
            
            if (!existingProduct) {
                await Termek.create(termek);
                console.log(`Háztartási termék hozzáadva: ${termek.nev}`);
                addedCount++;
            } else {
                console.log(`A termék már létezik: ${termek.nev}`);
            }
        }
        
        console.log(`Összesen ${addedCount} új háztartási termék került hozzáadásra.`);
        console.log("Háztartási termékek hozzáadása befejeződött!");
    } catch (error) {
        console.error("Hiba a háztartási termékek hozzáadásakor:", error);
    } finally {
        process.exit(0);
    }
}

// Futtatás
addHouseholdProducts();

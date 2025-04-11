const db = require('./models');
const Termek = db.Termek;


const haztartasi = [
    { 
        nev: "Almalé 1l", 
        kep: "almale1l.png"
    },
    { 
        nev: "Ásványvíz 0.5l", 
        kep: "asvanyviz05l.png"
    },
    { 
        nev: "Ásványvíz 1.5l", 
        kep: "asvanyviz15l.png"
    },
    { 
        nev: "Coca-Cola 0.5l", 
        kep: "cocacola05l.png"
    },
    { 
        nev: "Fanta 0.5l", 
        kep: "fanta05l.png"
    },
    { 
        nev: "Narancslé 1l", 
        kep: "narancsle1l.png"
    },
    { 
        nev: "Sprite 0.5l", 
        kep: "sprite05l.png"
    }
];

async function updateHouseholdImages() {
    try {
        console.log("Kapcsolódás az adatbázishoz...");
        await db.sequelize.authenticate();
        console.log("Kapcsolat sikeres!");
        
        console.log("Háztartási termék képek frissítése...");
        let updatedCount = 0;
        
        for (const termek of haztartasi) {
            
            const product = await Termek.findOne({ where: { nev: termek.nev } });
            
            if (product) {
                
                await product.update({ kep: termek.kep });
                console.log(`Termék kép frissítve: ${termek.nev} -> ${termek.kep}`);
                updatedCount++;
            } else {
                console.log(`A termék nem található: ${termek.nev}`);
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


updateHouseholdImages();

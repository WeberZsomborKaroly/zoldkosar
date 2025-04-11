const db = require('./models');
const Termek = db.Termek;
const Kategoria = db.Kategoria;


const nonFoodProducts = [
    { 
        nev: "Aquafresh fogkrém",
        leiras: "Friss mentás fogkrém az egészséges fogakért",
        ar: 850,
        kep: "aquafreshfogkrem.png",
        keszlet: 30
    },
    { 
        nev: "Fogkefe",
        leiras: "Puha sörtéjű fogkefe alapos tisztításhoz",
        ar: 550,
        kep: "fogkefe.png",
        keszlet: 40
    },
    { 
        nev: "Üvegpohár",
        leiras: "Átlátszó üvegpohár 250ml",
        ar: 450,
        kep: "pohar.png",
        keszlet: 25
    },
    { 
        nev: "Tányér",
        leiras: "Fehér porcelán tányér 25cm",
        ar: 950,
        kep: "tanyer.png",
        keszlet: 20
    }
];

async function addNonFoodProducts() {
    try {
        console.log("Kapcsolódás az adatbázishoz...");
        await db.sequelize.authenticate();
        console.log("Kapcsolat sikeres!");
        
        
        const nonFoodCategory = await Kategoria.findOne({ where: { nev: 'Non-food' } });
        
        if (!nonFoodCategory) {
            console.error("A 'Non-food' kategória nem található!");
            return;
        }
        
        const nonFoodCategoryId = nonFoodCategory.id;
        console.log(`Non-food kategória ID: ${nonFoodCategoryId}`);
        
        console.log("Non-food termékek hozzáadása...");
        let addedCount = 0;
        
        for (const product of nonFoodProducts) {
           
            const existingProduct = await Termek.findOne({ 
                where: { 
                    nev: product.nev,
                    kategoria_id: nonFoodCategoryId
                } 
            });
            
            if (existingProduct) {
                console.log(`A termék már létezik: ${product.nev}`);
                continue;
            }
            
           
            await Termek.create({
                nev: product.nev,
                leiras: product.leiras,
                ar: product.ar,
                kep: product.kep,
                keszlet: product.keszlet,
                kategoria_id: nonFoodCategoryId,
                aktiv: true
            });
            
            console.log(`Új termék hozzáadva: ${product.nev}`);
            addedCount++;
        }
        
        console.log(`Összesen ${addedCount} új non-food termék került hozzáadásra.`);
        console.log("Non-food termékek hozzáadása befejeződött!");
    } catch (error) {
        console.error("Hiba a termékek hozzáadásakor:", error);
    } finally {
        process.exit(0);
    }
}


addNonFoodProducts();

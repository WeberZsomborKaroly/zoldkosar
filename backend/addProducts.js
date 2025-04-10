const db = require('./models');
const Termek = db.Termek;

// Termék kategóriák
const kategoriak = [1, 2, 3, 4, 5]; // Feltételezzük, hogy ezek a kategória ID-k léteznek

// Termék adatok generálása
const termekek = [
    { nev: "Ásványvíz 0.5l", leiras: "Szénsavmentes ásványvíz", ar: 150, keszlet: 200, kategoria_id: 1, kep: "asvany.jpg" },
    { nev: "Ásványvíz 1.5l", leiras: "Szénsavmentes ásványvíz", ar: 250, keszlet: 150, kategoria_id: 1, kep: "asvany15.jpg" },
    { nev: "Coca-Cola 0.5l", leiras: "Szénsavas üdítőital", ar: 350, keszlet: 120, kategoria_id: 1, kep: "cola.jpg" },
    { nev: "Fanta 0.5l", leiras: "Narancs ízű szénsavas üdítőital", ar: 350, keszlet: 100, kategoria_id: 1, kep: "fanta.jpg" },
    { nev: "Sprite 0.5l", leiras: "Citrom ízű szénsavas üdítőital", ar: 350, keszlet: 90, kategoria_id: 1, kep: "sprite.jpg" },
    { nev: "Soproni sör 0.5l", leiras: "Magyar világos sör", ar: 400, keszlet: 80, kategoria_id: 1, kep: "soproni.jpg" },
    { nev: "Dreher sör 0.5l", leiras: "Magyar világos sör", ar: 420, keszlet: 75, kategoria_id: 1, kep: "dreher.jpg" },
    { nev: "Borsodi sör 0.5l", leiras: "Magyar világos sör", ar: 390, keszlet: 85, kategoria_id: 1, kep: "borsodi.jpg" },
    { nev: "Narancslé 1l", leiras: "100% gyümölcstartalmú narancslé", ar: 600, keszlet: 50, kategoria_id: 1, kep: "narancle.jpg" },
    { nev: "Almalé 1l", leiras: "100% gyümölcstartalmú almalé", ar: 550, keszlet: 60, kategoria_id: 1, kep: "almale.jpg" },
    
    { nev: "Kenyér fehér", leiras: "Friss fehér kenyér", ar: 450, keszlet: 40, kategoria_id: 2, kep: "kenyer.jpg" },
    { nev: "Zsemle", leiras: "Friss zsemle", ar: 50, keszlet: 100, kategoria_id: 2, kep: "zsemle.jpg" },
    { nev: "Kifli", leiras: "Friss kifli", ar: 50, keszlet: 100, kategoria_id: 2, kep: "kifli.jpg" },
    { nev: "Kakaós csiga", leiras: "Friss kakaós csiga", ar: 250, keszlet: 30, kategoria_id: 2, kep: "kakaos.jpg" },
    { nev: "Túrós batyu", leiras: "Friss túrós batyu", ar: 280, keszlet: 25, kategoria_id: 2, kep: "turos.jpg" },
    { nev: "Pogácsa", leiras: "Sajtos pogácsa", ar: 200, keszlet: 40, kategoria_id: 2, kep: "pogacsa.jpg" },
    { nev: "Croissant", leiras: "Vajas croissant", ar: 300, keszlet: 35, kategoria_id: 2, kep: "croissant.jpg" },
    { nev: "Bagett", leiras: "Francia bagett", ar: 350, keszlet: 20, kategoria_id: 2, kep: "bagett.jpg" },
    { nev: "Rozskenyér", leiras: "Teljes kiőrlésű rozskenyér", ar: 500, keszlet: 15, kategoria_id: 2, kep: "rozs.jpg" },
    { nev: "Briós", leiras: "Édes briós", ar: 320, keszlet: 25, kategoria_id: 2, kep: "brios.jpg" },
    
    { nev: "Csirkemell filé 1kg", leiras: "Friss csirkemell filé", ar: 1800, keszlet: 30, kategoria_id: 3, kep: "csirkemell.jpg" },
    { nev: "Sertéskaraj 1kg", leiras: "Friss sertéskaraj", ar: 2200, keszlet: 25, kategoria_id: 3, kep: "karaj.jpg" },
    { nev: "Darált hús 500g", leiras: "Sertés darált hús", ar: 1200, keszlet: 20, kategoria_id: 3, kep: "daralt.jpg" },
    { nev: "Csirkecomb 1kg", leiras: "Friss csirkecomb", ar: 1500, keszlet: 35, kategoria_id: 3, kep: "csirkecomb.jpg" },
    { nev: "Sertésoldalas 1kg", leiras: "Friss sertésoldalas", ar: 1900, keszlet: 15, kategoria_id: 3, kep: "oldalas.jpg" },
    { nev: "Pulykamell 1kg", leiras: "Friss pulykamell", ar: 2000, keszlet: 20, kategoria_id: 3, kep: "pulyka.jpg" },
    { nev: "Marha hátszín 1kg", leiras: "Prémium marha hátszín", ar: 5000, keszlet: 10, kategoria_id: 3, kep: "marha.jpg" },
    { nev: "Csirkeszárny 1kg", leiras: "Friss csirkeszárny", ar: 1300, keszlet: 40, kategoria_id: 3, kep: "szarny.jpg" },
    { nev: "Kolbász 200g", leiras: "Házi kolbász", ar: 900, keszlet: 30, kategoria_id: 3, kep: "kolbasz.jpg" },
    { nev: "Szalámi 100g", leiras: "Téliszalámi", ar: 800, keszlet: 25, kategoria_id: 3, kep: "szalami.jpg" },
    
    { nev: "Burgonya 1kg", leiras: "Friss burgonya", ar: 350, keszlet: 100, kategoria_id: 4, kep: "burgonya.jpg" },
    { nev: "Hagyma 1kg", leiras: "Vöröshagyma", ar: 300, keszlet: 80, kategoria_id: 4, kep: "hagyma.jpg" },
    { nev: "Répa 1kg", leiras: "Friss sárgarépa", ar: 400, keszlet: 70, kategoria_id: 4, kep: "repa.jpg" },
    { nev: "Uborka 1kg", leiras: "Friss kígyóuborka", ar: 600, keszlet: 50, kategoria_id: 4, kep: "uborka.jpg" },
    { nev: "Paprika 1kg", leiras: "Friss kaliforniai paprika", ar: 800, keszlet: 40, kategoria_id: 4, kep: "paprika.jpg" },
    { nev: "Cukkini 1kg", leiras: "Friss cukkini", ar: 700, keszlet: 30, kategoria_id: 4, kep: "cukkini.jpg" },
    { nev: "Padlizsán 1kg", leiras: "Friss padlizsán", ar: 750, keszlet: 25, kategoria_id: 4, kep: "padlizsan.jpg" },
    { nev: "Fokhagyma 100g", leiras: "Friss fokhagyma", ar: 300, keszlet: 60, kategoria_id: 4, kep: "fokhagyma.jpg" },
    { nev: "Saláta", leiras: "Friss fejes saláta", ar: 350, keszlet: 45, kategoria_id: 4, kep: "salata.jpg" },
    { nev: "Brokkoli 500g", leiras: "Friss brokkoli", ar: 500, keszlet: 35, kategoria_id: 4, kep: "brokkoli.jpg" },
    
    { nev: "Tej 1l", leiras: "2,8%-os tehéntej", ar: 350, keszlet: 100, kategoria_id: 5, kep: "tej.jpg" },
    { nev: "Sajt 200g", leiras: "Trappista sajt", ar: 600, keszlet: 50, kategoria_id: 5, kep: "sajt.jpg" },
    { nev: "Túró 250g", leiras: "Félzsíros túró", ar: 400, keszlet: 40, kategoria_id: 5, kep: "turo.jpg" },
    { nev: "Tejföl 330g", leiras: "20%-os tejföl", ar: 450, keszlet: 60, kategoria_id: 5, kep: "tejfol.jpg" },
    { nev: "Vaj 100g", leiras: "82%-os vaj", ar: 500, keszlet: 45, kategoria_id: 5, kep: "vaj.jpg" },
    { nev: "Joghurt 150g", leiras: "Natúr joghurt", ar: 250, keszlet: 70, kategoria_id: 5, kep: "joghurt.jpg" },
    { nev: "Kefir 175g", leiras: "Élőflórás kefir", ar: 220, keszlet: 55, kategoria_id: 5, kep: "kefir.jpg" },
    { nev: "Mozzarella 125g", leiras: "Friss mozzarella sajt", ar: 550, keszlet: 30, kategoria_id: 5, kep: "mozzarella.jpg" },
    { nev: "Mascarpone 250g", leiras: "Krémes mascarpone", ar: 700, keszlet: 25, kategoria_id: 5, kep: "mascarpone.jpg" },
    { nev: "Parmezán 100g", leiras: "Érlelt parmezán sajt", ar: 900, keszlet: 20, kategoria_id: 5, kep: "parmezan.jpg" }
];

async function addProducts() {
    try {
        console.log("Kapcsolódás az adatbázishoz...");
        await db.sequelize.authenticate();
        console.log("Kapcsolat sikeres!");
        
        console.log("Termékek hozzáadása...");
        let addedCount = 0;
        
        for (const termek of termekek) {
            // Ellenőrizzük, hogy létezik-e már ilyen nevű termék
            const existingProduct = await Termek.findOne({ where: { nev: termek.nev } });
            
            if (!existingProduct) {
                await Termek.create(termek);
                console.log(`Termék hozzáadva: ${termek.nev}`);
                addedCount++;
            } else {
                console.log(`A termék már létezik: ${termek.nev}`);
            }
        }
        
        console.log(`Összesen ${addedCount} új termék került hozzáadásra.`);
        console.log("Termékek hozzáadása befejeződött!");
    } catch (error) {
        console.error("Hiba a termékek hozzáadásakor:", error);
    } finally {
        process.exit(0);
    }
}

// Futtatás
addProducts();

const emailService = require('./services/emailService');

// Teszt rendelési adatok
const testOrderData = {
    id: 12345,
    vevoAdatok: {
        nev: 'Teszt Felhasználó',
        email: 'zsomborweber08@gmail.com', // Saját e-mail cím a teszteléshez
        telefonszam: '+36 30 123 4567',
        szallitasiCim: '1234 Budapest, Példa utca 1.'
    },
    termekek: [
        {
            termek_id: 1,
            termekNev: 'Teszt termék 1',
            mennyiseg: 2,
            ar: 4900
        },
        {
            termek_id: 2,
            termekNev: 'Teszt termék 2',
            mennyiseg: 1,
            ar: 12500
        }
    ],
    vegosszeg: 22300,
    kedvezmeny: 0,
    szallitasiKoltseg: 990,
    kupon: null
};

// Teszt kuponos rendelési adatok
const testOrderWithCouponData = {
    id: 12346,
    vevoAdatok: {
        nev: 'Teszt Felhasználó',
        email: 'zsomborweber08@gmail.com', // Saját e-mail cím a teszteléshez
        telefonszam: '+36 30 123 4567',
        szallitasiCim: '1234 Budapest, Példa utca 1.'
    },
    termekek: [
        {
            termek_id: 1,
            termekNev: 'Teszt termék 1',
            mennyiseg: 2,
            ar: 4900
        },
        {
            termek_id: 2,
            termekNev: 'Teszt termék 2',
            mennyiseg: 1,
            ar: 12500
        }
    ],
    vegosszeg: 19800,
    kedvezmeny: 2500,
    szallitasiKoltseg: 0,
    kupon: {
        id: 1,
        kod: 'TESZT25',
        tipus: 'fix',
        ertek: 2500
    }
};

// Teszt e-mail küldése
async function testOrderEmails() {
    console.log('E-mail szolgáltatás tesztelése...');
    
    try {
        // Először teszteljük a kapcsolatot
        console.log('1. E-mail kapcsolat tesztelése...');
        const connectionResult = await emailService.testEmailConnection();
        
        if (connectionResult.success) {
            console.log('Kapcsolat teszt sikeres!');
            if (connectionResult.url) {
                console.log('Teszt e-mail megtekinthető itt:', connectionResult.url);
            }
        } else {
            console.error('Kapcsolat teszt sikertelen:', connectionResult.error);
        }
        
        // Normál rendelés visszaigazolás tesztelése
        console.log('\n2. Normál rendelés visszaigazolás tesztelése...');
        const normalOrderResult = await emailService.sendOrderConfirmation(testOrderData);
        
        if (normalOrderResult.success) {
            console.log('Normál rendelés visszaigazolás sikeresen elküldve!');
            if (normalOrderResult.url) {
                console.log('Teszt e-mail megtekinthető itt:', normalOrderResult.url);
            }
        } else {
            console.error('Normál rendelés visszaigazolás sikertelen:', normalOrderResult.error);
        }
        
        // Kuponos rendelés visszaigazolás tesztelése
        console.log('\n3. Kuponos rendelés visszaigazolás tesztelése...');
        const couponOrderResult = await emailService.sendOrderConfirmation(testOrderWithCouponData);
        
        if (couponOrderResult.success) {
            console.log('Kuponos rendelés visszaigazolás sikeresen elküldve!');
            if (couponOrderResult.url) {
                console.log('Teszt e-mail megtekinthető itt:', couponOrderResult.url);
            }
        } else {
            console.error('Kuponos rendelés visszaigazolás sikertelen:', couponOrderResult.error);
        }
        
        console.log('\nTesztelés befejezve!');
    } catch (error) {
        console.error('Hiba a tesztelés során:', error);
    }
}

// Teszt futtatása
testOrderEmails().catch(console.error);

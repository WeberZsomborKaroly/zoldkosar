require('dotenv').config();
const emailService = require('./services/emailService');

// Teszt e-mail küldése
async function testEmail() {
    console.log('E-mail küldés tesztelése...');
    console.log('Környezeti változók:');
    console.log('- EMAIL_HOST:', process.env.EMAIL_HOST);
    console.log('- EMAIL_PORT:', process.env.EMAIL_PORT);
    console.log('- EMAIL_USER:', process.env.EMAIL_USER ? '***' : 'nincs beállítva');
    console.log('- EMAIL_PASS:', process.env.EMAIL_PASS ? '***' : 'nincs beállítva');
    console.log('- EMAIL_FROM:', process.env.EMAIL_FROM);
    
    try {
        // Teszt e-mail küldése
        const result = await emailService.testEmailConnection();
        
        if (result.success) {
            console.log('E-mail sikeresen elküldve!');
            console.log('Üzenet azonosító:', result.messageId);
        } else {
            console.error('Hiba történt az e-mail küldése során:', result.error);
        }
    } catch (error) {
        console.error('Váratlan hiba történt:', error);
    }
}

// Teszt rendelési adatok létrehozása
function createTestOrderData() {
    return {
        id: Math.floor(Math.random() * 10000),
        vevoAdatok: {
            nev: 'Teszt Felhasználó',
            email: process.env.TEST_EMAIL_TO || 'zsomborweber08@gmail.com', // Ide írd a saját e-mail címed
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
}

// Teszt rendelés visszaigazoló e-mail küldése
async function testOrderConfirmation() {
    console.log('Rendelés visszaigazoló e-mail küldés tesztelése...');
    
    try {
        const orderData = createTestOrderData();
        
        // Kupon hozzáadása a rendeléshez (opcionális)
        const withCoupon = process.argv.includes('--with-coupon');
        if (withCoupon) {
            orderData.kupon = {
                id: 1,
                kod: 'TESZT25',
                tipus: 'fix',
                ertek: 2500
            };
            orderData.kedvezmeny = 2500;
            orderData.vegosszeg = orderData.vegosszeg - orderData.kedvezmeny;
        }
        
        // Rendelés visszaigazoló e-mail küldése
        const result = await emailService.sendOrderConfirmation(orderData);
        
        if (result.success) {
            console.log('Rendelés visszaigazoló e-mail sikeresen elküldve!');
            console.log('Üzenet azonosító:', result.messageId);
        } else {
            console.error('Hiba történt a rendelés visszaigazoló e-mail küldése során:', result.error);
        }
    } catch (error) {
        console.error('Váratlan hiba történt:', error);
    }
}

// Parancssori argumentumok feldolgozása
const args = process.argv.slice(2);
if (args.includes('--order')) {
    testOrderConfirmation();
} else {
    testEmail();
}

// Használat:
// node testEmail.js             - Egyszerű teszt e-mail küldése
// node testEmail.js --order     - Rendelés visszaigazoló e-mail küldése
// node testEmail.js --order --with-coupon - Rendelés visszaigazoló e-mail küldése kuponnal

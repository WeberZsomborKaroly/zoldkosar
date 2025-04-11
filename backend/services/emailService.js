const nodemailer = require('nodemailer');
require('dotenv').config();


let transporter;


const initializeTransporter = async () => {
    
    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true' || false,
        auth: {
            user: process.env.EMAIL_USER || 'your-email@gmail.com',
            pass: process.env.EMAIL_PASS || 'your-app-password'
        },
        tls: {
            rejectUnauthorized: false 
        }
    });
    
    console.log('SMTP transporter inicializálva');
};


const testEmailConnection = async () => {
    if (!transporter) {
        await initializeTransporter();
    }
    
    try {
        
        await transporter.verify();
        console.log('E-mail szerver kapcsolat sikeres');
        
        
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"Webshop Teszt" <info@webshop.hu>',
            to: process.env.TEST_EMAIL_TO || 'zsomborweber08@gmail.com',
            subject: 'Kapcsolat teszt',
            text: 'Ha ezt az e-mailt látja, akkor az e-mail küldés megfelelően működik.'
        });
        
        console.log('Teszt e-mail elküldve:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('E-mail szerver kapcsolat hiba:', error);
        return { success: false, error: error.message };
    }
};


const formatAddress = (vevoAdatok) => {
    console.log("Formázandó vevő adatok:", JSON.stringify(vevoAdatok));
    
    try {
        
        if (typeof vevoAdatok === 'string') {
            try {
                vevoAdatok = JSON.parse(vevoAdatok);
            } catch (e) {
                console.error("Hiba a vevő adatok parse-olásakor:", e);
            }
        }
        
        
        if (vevoAdatok.szallitasiCim && typeof vevoAdatok.szallitasiCim === 'object') {
            const cim = vevoAdatok.szallitasiCim;
            return `${cim.iranyitoszam || ''} ${cim.varos || ''}, ${cim.utca || ''} ${cim.hazszam || ''}, ${cim.megye || ''}`.trim();
        }
        
        
        if (vevoAdatok.szallitasiCim && typeof vevoAdatok.szallitasiCim === 'string') {
            try {
                const cim = JSON.parse(vevoAdatok.szallitasiCim);
                return `${cim.iranyitoszam || ''} ${cim.varos || ''}, ${cim.utca || ''} ${cim.hazszam || ''}, ${cim.megye || ''}`.trim();
            } catch (e) {
                console.error("Hiba a szállítási cím parse-olásakor:", e);
                return vevoAdatok.szallitasiCim;
            }
        }
        
        
        if (vevoAdatok.cim) {
            return vevoAdatok.cim;
        }
    } catch (error) {
        console.error("Hiba a cím formázásakor:", error);
    }
    
    return 'Nincs megadva';
};


const formatPhone = (vevoAdatok) => {
    try {
        
        if (typeof vevoAdatok === 'string') {
            try {
                vevoAdatok = JSON.parse(vevoAdatok);
            } catch (e) {
                console.error("Hiba a vevő adatok parse-olásakor:", e);
            }
        }
        
        
        if (vevoAdatok.telefon) {
            return vevoAdatok.telefon;
        }
        
        if (vevoAdatok.telefonszam) {
            return vevoAdatok.telefonszam;
        }
    } catch (error) {
        console.error("Hiba a telefonszám formázásakor:", error);
    }
    
    return 'Nincs megadva';
};


const formatName = (vevoAdatok) => {
    try {

        if (typeof vevoAdatok === 'string') {
            try {
                vevoAdatok = JSON.parse(vevoAdatok);
            } catch (e) {
                console.error("Hiba a vevő adatok parse-olásakor:", e);
            }
        }
        
        if (vevoAdatok.nev) {
            return vevoAdatok.nev;
        }
        
        
        if (vevoAdatok.vezeteknev && vevoAdatok.keresztnev) {
            return `${vevoAdatok.vezeteknev} ${vevoAdatok.keresztnev}`;
        }
    } catch (error) {
        console.error("Hiba a név formázásakor:", error);
    }
    
    return 'Tisztelt Vásárló';
};


const formatEmail = (vevoAdatok) => {
    try {
        
        if (typeof vevoAdatok === 'string') {
            try {
                vevoAdatok = JSON.parse(vevoAdatok);
            } catch (e) {
                console.error("Hiba a vevő adatok parse-olásakor:", e);
            }
        }
        
        if (vevoAdatok.email) {
            return vevoAdatok.email;
        }
    } catch (error) {
        console.error("Hiba az email formázásakor:", error);
    }
    
    return 'Nincs megadva';
};


const sendOrderConfirmation = async (orderData) => {
    if (!transporter) {
        await initializeTransporter();
    }
    
    try {
        if (!orderData || !orderData.vevoAdatok || !orderData.vevoAdatok.email) {
            throw new Error('Hiányzó e-mail cím vagy rendelési adatok');
        }

        
        const productsList = orderData.termekek.map(item => {
            return `
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.termekNev || 'Termék'}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.mennyiseg} db</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.ar.toLocaleString()} Ft</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${(item.ar * item.mennyiseg).toLocaleString()} Ft</td>
                </tr>
            `;
        }).join('');

        
        let couponInfo = '';
        if (orderData.kupon) {
            couponInfo = `
                <tr>
                    <td colspan="3" style="padding: 8px; text-align: right; font-weight: bold;">Kupon kedvezmény (${orderData.kupon.kod}):</td>
                    <td style="padding: 8px; font-weight: bold;">-${orderData.kedvezmeny.toLocaleString()} Ft</td>
                </tr>
            `;
        }

        
        let shippingCost = '';
        if (orderData.szallitasiKoltseg) {
            shippingCost = `
                <tr>
                    <td colspan="3" style="padding: 8px; text-align: right; font-weight: bold;">Szállítási költség:</td>
                    <td style="padding: 8px; font-weight: bold;">${orderData.szallitasiKoltseg.toLocaleString()} Ft</td>
                </tr>
            `;
        }

        // E-mail HTML tartalom
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Köszönjük a rendelését!</h2>
                <p>Kedves ${formatName(orderData.vevoAdatok)},</p>
                <p>Rendelését sikeresen rögzítettük. Az alábbiakban találja a rendelés részleteit:</p>
                
                <h3 style="margin-top: 20px;">Rendelés adatai</h3>
                <p><strong>Rendelésszám:</strong> #${orderData.id || 'N/A'}</p>
                <p><strong>Dátum:</strong> ${new Date().toLocaleDateString('hu-HU')}</p>
                
                <h3 style="margin-top: 20px;">Szállítási információk</h3>
                <p><strong>Név:</strong> ${formatName(orderData.vevoAdatok)}</p>
                <p><strong>Cím:</strong> ${formatAddress(orderData.vevoAdatok)}</p>
                <p><strong>Telefonszám:</strong> ${formatPhone(orderData.vevoAdatok) || 'Nincs megadva'}</p>
                <p><strong>Email:</strong> ${formatEmail(orderData.vevoAdatok) || 'Nincs megadva'}</p>
                
                <h3 style="margin-top: 20px;">Rendelés részletei</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th style="padding: 10px; text-align: left;">Termék</th>
                            <th style="padding: 10px; text-align: left;">Mennyiség</th>
                            <th style="padding: 10px; text-align: left;">Egységár</th>
                            <th style="padding: 10px; text-align: left;">Összesen</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productsList}
                        ${couponInfo}
                        ${shippingCost}
                        <tr>
                            <td colspan="3" style="padding: 8px; text-align: right; font-weight: bold;">Végösszeg:</td>
                            <td style="padding: 8px; font-weight: bold;">${orderData.vegosszeg.toLocaleString()} Ft</td>
                        </tr>
                    </tbody>
                </table>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                    <p>Kérdés esetén keressen minket az alábbi elérhetőségeken:</p>
                    <p>Email: info@webshop.hu</p>
                    <p>Telefon: +36 1 234 5678</p>
                </div>
                
                <p style="margin-top: 30px; font-size: 12px; color: #777;">
                    Ez egy automatikus üzenet, kérjük, ne válaszoljon rá.
                </p>
            </div>
        `;

        // E-mail küldése
        const mailOptions = {
            from: process.env.EMAIL_FROM || '"Webshop" <info@webshop.hu>',
            to: formatEmail(orderData.vevoAdatok),
            subject: `Rendelés visszaigazolás - #${orderData.id || 'N/A'}`,
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Rendelés visszaigazoló e-mail elküldve:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Hiba az e-mail küldése során:', error);
        return { success: false, error: error.message };
    }
};


initializeTransporter().catch(console.error);

module.exports = {
    testEmailConnection,
    sendOrderConfirmation
};

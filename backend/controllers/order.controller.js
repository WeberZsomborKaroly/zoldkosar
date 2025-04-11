const db = require("../models");
const Rendeles = db.Rendeles;
const RendelesTetel = db.RendelesTetelek;
const Termek = db.Termek;
const Sequelize = db.Sequelize;
const Kupon = db.Kupon;
const emailService = require("../services/emailService");


exports.createOrder = async (req, res) => {
    console.log("=== Starting createOrder function ===");
    console.log("Rendelés adatok beérkeztek:", JSON.stringify(req.body));
    
    
    const t = await db.sequelize.transaction();
    
    try {
        const { vevoAdatok, termekek, vegosszeg, kupon, kedvezmeny, szallitasiKoltseg } = req.body;
        
        console.log("Vevő adatok:", JSON.stringify(vevoAdatok));
        
        
        if (!vevoAdatok || !termekek || !vegosszeg) {
            console.error("Hiányzó adatok a rendelésnél.");
            await t.rollback();
            return res.status(400).json({
                message: "Hiányzó adatok! Kérjük adja meg a vevő adatait, a termékeket és a végösszeget."
            });
        }
        
        if (!Array.isArray(termekek) || termekek.length === 0) {
            console.error("Missing or invalid termekek array");
            await t.rollback();
            return res.status(400).json({ uzenet: "Hiányzó vagy érvénytelen termék adatok!" });
        }
        
        
        console.log("Termékek részletes adatai:");
        termekek.forEach((item, index) => {
            console.log(`Termék #${index + 1}:`, JSON.stringify(item));
        });
        
        
        const userId = req.userId || 1;
        console.log("Using user ID:", userId);
        
        console.log("Creating order with data:", {
            felhasznalo_id: userId,
            osszeg: vegosszeg,
            statusz: "feldolgozas_alatt",
            szallitasi_cim: typeof vevoAdatok === 'string' ? vevoAdatok : JSON.stringify(vevoAdatok)
        });
        
        
        const rendeles = await Rendeles.create({
            felhasznalo_id: userId,
            osszeg: vegosszeg,
            statusz: "feldolgozas_alatt",
            szallitasi_cim: typeof vevoAdatok === 'string' ? vevoAdatok : JSON.stringify(vevoAdatok),
            kupon_id: kupon && kupon.id ? kupon.id : null
        }, { transaction: t });
        
        console.log("Rendelés létrehozva:", rendeles.id);
        
        
        console.log("Creating order items...");
        const orderItemPromises = termekek.map(async item => {
            console.log("Creating order item:", {
                rendeles_id: rendeles.id,
                termek_id: item.termek_id,
                mennyiseg: item.mennyiseg,
                egysegar: item.ar
            });
            
            
            const termek = await Termek.findByPk(item.termek_id);
            item.termekNev = termek ? termek.nev : 'Ismeretlen termék';
            
            
            if (termek) {
                try {
                    const ujKeszlet = Math.max(0, termek.keszlet - item.mennyiseg);
                    console.log(`Készlet frissítése: ${termek.id} (${termek.nev}) - Régi: ${termek.keszlet}, Új: ${ujKeszlet}, Mennyiség: ${item.mennyiseg}`);
                    
                    
                    await db.sequelize.query(
                        'UPDATE termekek SET keszlet = ? WHERE id = ?',
                        {
                            replacements: [ujKeszlet, termek.id],
                            type: db.sequelize.QueryTypes.UPDATE,
                            transaction: t
                        }
                    );
                    
                    console.log(`Készlet frissítve a(z) ${termek.nev} terméknél: ${termek.keszlet} -> ${ujKeszlet}`);
                } catch (error) {
                    console.error(`Hiba a készlet frissítésekor (${termek.id}):`, error);
                    throw error;
                }
            }
            
            return RendelesTetel.create({
                rendeles_id: rendeles.id,
                termek_id: item.termek_id,
                mennyiseg: item.mennyiseg,
                egysegar: item.ar
            }, { transaction: t });
        });
        
        await Promise.all(orderItemPromises);
        console.log("All order items created successfully");
        
       
        if (kupon && kupon.id) {
            await Kupon.update(
                { felhasznalva: Sequelize.literal('felhasznalva + 1') },
                { where: { id: kupon.id }, transaction: t }
            );
        }
        

        await t.commit();
        console.log("Transaction committed successfully");
        
   
        let processedVevoAdatok = vevoAdatok;
        
       
        if (typeof vevoAdatok === 'string') {
            try {
                processedVevoAdatok = JSON.parse(vevoAdatok);
            } catch (e) {
                console.error("Hiba a vevő adatok parse-olásakor:", e);
            }
        }
        
        const orderDataForEmail = {
            id: rendeles.id,
            vevoAdatok: processedVevoAdatok,
            termekek: termekek,
            vegosszeg: vegosszeg,
            kupon: kupon,
            kedvezmeny: kedvezmeny || 0,
            szallitasiKoltseg: szallitasiKoltseg || 0
        };
        
        console.log("E-mail küldéshez előkészített adatok:", JSON.stringify(orderDataForEmail));
        
     
        try {
            const emailResult = await emailService.sendOrderConfirmation(orderDataForEmail);
            if (emailResult.success) {
                console.log("Rendelés visszaigazoló e-mail elküldve");
                if (emailResult.url) {
                    console.log("Teszt e-mail megtekinthető itt:", emailResult.url);
                }
            } else {
                console.error("Hiba az e-mail küldése során:", emailResult.error);
            }
        } catch (emailError) {
            console.error("Hiba az e-mail küldése során:", emailError);
            
        }
        
        // Return success response
        return res.status(201).json({
            uzenet: "Rendelés sikeresen létrehozva!",
            rendeles_id: rendeles.id
        });
    } catch (error) {
        
        await t.rollback();
        console.error("Error in createOrder:", error);
        
   
        return res.status(500).json({
            uzenet: "Hiba történt a rendelés feldolgozása során.",
            error: error.message
        });
    }
};


exports.getUserOrdersByEmail = async (req, res) => {
    try {
        const email = req.params.email;
        
        if (!email) {
            return res.status(400).json({
                message: "Email cím megadása kötelező!"
            });
        }
        
        console.log(`Felhasználó rendeléseinek lekérése email alapján: ${email}`);
        
        
        const orders = await db.Rendeles.findAll({
            where: {
                szallitasi_cim: {
                    [db.Sequelize.Op.like]: `%${email}%`
                }
            },
            order: [['letrehozva', 'DESC']]
        });
        
        console.log(`Talált rendelések száma: ${orders ? orders.length : 0}`);
        

        if (!orders || orders.length === 0) {
            return res.json([]);
        }
        
  
        const ordersWithItems = await Promise.all(orders.map(async (order) => {
  
            const tetelek = await db.RendelesTetel.findAll({
                where: { rendeles_id: order.id },
                include: [{
                    model: db.Termek,
                    attributes: ['id', 'nev']
                }]
            });
            
     
            let szallitasiAdatok = {};
            let szallitasiCim = order.szallitasi_cim || "";
            
            try {
                if (typeof order.szallitasi_cim === 'string' && order.szallitasi_cim.startsWith('{')) {
                    szallitasiAdatok = JSON.parse(order.szallitasi_cim);
     
                    if (szallitasiAdatok.szallitasiCim) {
                        const cim = szallitasiAdatok.szallitasiCim;
                        szallitasiCim = `${cim.iranyitoszam || ""} ${cim.varos || ""}, ${cim.utca || ""} ${cim.hazszam || ""}`;
                    }
                }
            } catch (error) {
                console.error('Hiba a szállítási cím feldolgozásakor:', error);
            }
            

            const rendelesSzam = order.rendeles_szam || `ORD-${new Date(order.letrehozva).getFullYear()}-${order.id.toString().padStart(3, '0')}`;
            

            const formattedItems = tetelek.map(tetel => ({
                id: tetel.id,
                termek_id: tetel.termek_id,
                mennyiseg: tetel.mennyiseg,
                egysegar: tetel.ar,
                nev: tetel.Termek ? tetel.Termek.nev : 'Ismeretlen termék'
            }));
            
     
            return {
                id: order.id,
                felhasznalo_id: order.felhasznalo_id,
                rendeles_szam: rendelesSzam,
                osszeg: order.osszeg,
                statusz: order.statusz,
                szallitasi_cim: szallitasiCim,
                letrehozva: order.letrehozva,
                modositva: order.modositva,
                termekek: formattedItems || []
            };
        }));
        
        res.json(ordersWithItems);
    } catch (error) {
        console.error('Hiba a rendelések lekérésékor email alapján:', error);
        res.status(500).json({
            message: "Hiba történt a rendelések lekérésékor.",
            error: error.message
        });
    }
};

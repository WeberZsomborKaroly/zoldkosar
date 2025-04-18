const db = require("../models");
const Rendeles = db.Rendeles;
const RendelesTetelek = db.RendelesTetelek;
const Kosar = db.Kosar;
const Termek = db.Termek;
const { Op } = require("sequelize");

// Create a new order
exports.createOrder = async (req, res) => {
    // Start a transaction to ensure data integrity
    const t = await db.sequelize.transaction();
    
    try {
        console.log("Rendelés adatok beérkeztek:", JSON.stringify(req.body));
        const { vevoAdatok, termekek, vegosszeg, kupon, kedvezmeny, szallitasiKoltseg } = req.body;
        
        // Validate required data
        if (!vevoAdatok || !termekek || !vegosszeg) {
            console.error("Hiányzó adatok a rendelésnél.");
            await t.rollback();
            return res.status(400).json({
                message: "Hiányzó adatok! Kérjük adja meg a vevő adatait, a termékeket és a végösszeget."
            });
        }
        
        // Create the order
        const rendeles = await Rendeles.create({
            felhasznalo_id: req.userId || 1, // Use userId from token if available, otherwise default to 1
            osszeg: vegosszeg,
            statusz: "feldolgozas_alatt",
            szallitasi_cim: typeof vevoAdatok === 'string' ? vevoAdatok : JSON.stringify(vevoAdatok),
            kupon_id: kupon && kupon.id ? kupon.id : null
        }, { transaction: t });
        
        console.log("Rendelés létrehozva:", rendeles.id);
        
        // Create order items
        const rendelesTetelPromises = termekek.map(async tetel => {
            console.log("Tétel feldolgozása:", tetel);
            
            // Lekérjük a termék adatait
            const termek = await Termek.findByPk(tetel.termek_id);
            
            // Csökkentjük a készletet a megrendelt mennyiséggel
            if (termek) {
                try {
                    const ujKeszlet = Math.max(0, termek.keszlet - tetel.mennyiseg);
                    console.log(`Készlet frissítése: ${termek.id} (${termek.nev}) - Régi: ${termek.keszlet}, Új: ${ujKeszlet}, Mennyiség: ${tetel.mennyiseg}`);
                    
                    // Közvetlen SQL lekérdezés a készlet frissítéséhez
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
                
                // Termék nevének mentése az e-mail küldéshez
                tetel.termekNev = termek.nev;
            } else {
                tetel.termekNev = 'Ismeretlen termék';
            }
            
            return RendelesTetelek.create({
                rendeles_id: rendeles.id,
                termek_id: tetel.termek_id,
                mennyiseg: tetel.mennyiseg,
                ar: tetel.ar
            }, { transaction: t });
        });
        
        await Promise.all(rendelesTetelPromises);
        console.log("Rendelési tételek létrehozva");
        
        // Clear the user's cart
        await Kosar.destroy({
            where: { felhasznalo_id: req.userId || 1 }, // Use userId from token if available, otherwise default to 1
            transaction: t
        });
        console.log("Kosár kiürítve");
        
        // Commit the transaction
        await t.commit();
        
        console.log("Rendelés sikeresen létrehozva.");
        return res.status(201).json({
            message: "Rendelés sikeresen létrehozva!",
            rendeles_id: rendeles.id
        });
    } catch (error) {
        // Rollback the transaction in case of error
        await t.rollback();
        
        console.error("Hiba a rendelés létrehozásakor:", error);
        return res.status(500).json({
            message: "Hiba történt a rendelés feldolgozása során.",
            error: error.message
        });
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        console.log("Rendelések lekérése...");
        const rendelesek = await Rendeles.findAll({
            order: [['id', 'DESC']]
        });
        
        console.log("Rendelések lekérdezve.");
        return res.json(rendelesek);
    } catch (error) {
        console.error("Hiba a rendelések lekérésekor:", error);
        return res.status(500).json({
            message: "Hiba történt a rendelések lekérése során.",
            error: error.message
        });
    }
};

// Get order by ID with details
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log(`Rendelés lekérése azonosító alapján: ${id}`);
        const rendeles = await Rendeles.findByPk(id, {
            include: [{
                model: RendelesTetelek,
                include: [{
                    model: Termek
                }]
            }]
        });
        
        if (!rendeles) {
            console.error(`Rendelés nem található azonosító alapján: ${id}`);
            return res.status(404).json({
                message: "A rendelés nem található!"
            });
        }
        
        console.log(`Rendelés lekérdezve azonosító alapján: ${id}`);
        return res.json(rendeles);
    } catch (error) {
        console.error("Hiba a rendelés lekérésekor:", error);
        return res.status(500).json({
            message: "Hiba történt a rendelés lekérése során.",
            error: error.message
        });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { statusz } = req.body;
        
        console.log(`Rendelés státuszának frissítése azonosító alapján: ${id}`);
        const rendeles = await Rendeles.findByPk(id);
        
        if (!rendeles) {
            console.error(`Rendelés nem található azonosító alapján: ${id}`);
            return res.status(404).json({
                message: "A rendelés nem található!"
            });
        }
        
        rendeles.statusz = statusz;
        await rendeles.save();
        
        console.log(`Rendelés státusza frissítve azonosító alapján: ${id}`);
        return res.json({
            message: "Rendelés státusza sikeresen frissítve!",
            rendeles
        });
    } catch (error) {
        console.error("Hiba a rendelés státuszának frissítésekor:", error);
        return res.status(500).json({
            message: "Hiba történt a rendelés státuszának frissítése során.",
            error: error.message
        });
    }
};

// Get orders by email
exports.getOrdersByEmail = async (req, res) => {
    try {
        const email = req.params.email;
        
        if (!email) {
            return res.status(400).json({
                message: "Email cím megadása kötelező!"
            });
        }
        
        // Lekérjük a rendeléseket a megadott email alapján
        const [orders] = await db.sequelize.query(`
            SELECT 
                r.id,
                r.rendeles_szam,
                r.osszeg,
                r.statusz,
                r.szallitasi_cim,
                r.letrehozva,
                r.modositva
            FROM 
                rendelesek r
            WHERE 
                r.szallitasi_cim LIKE :email
            ORDER BY 
                r.letrehozva DESC
        `, {
            replacements: { email: `%${email}%` },
            type: db.sequelize.QueryTypes.SELECT
        });
        
        // Ha nincsenek rendelések, üres tömböt adunk vissza
        if (!orders || orders.length === 0) {
            return res.json([]);
        }
        
        // Lekérjük a rendelésekhez tartozó termékeket
        const ordersWithItems = await Promise.all(orders.map(async (order) => {
            // Lekérjük a rendelés tételeit
            const [items] = await db.sequelize.query(`
                SELECT 
                    rt.id,
                    rt.termek_id,
                    rt.mennyiseg,
                    rt.ar as egysegar,
                    t.nev
                FROM 
                    rendeles_tetelek rt
                JOIN 
                    termekek t ON rt.termek_id = t.id
                WHERE 
                    rt.rendeles_id = :orderId
            `, {
                replacements: { orderId: order.id },
                type: db.sequelize.QueryTypes.SELECT
            });
            
            // Feldolgozzuk a szállítási cím JSON-t, ha lehetséges
            let szallitasiAdatok = {};
            let szallitasiCim = order.szallitasi_cim || "";
            
            try {
                if (typeof order.szallitasi_cim === 'string' && order.szallitasi_cim.startsWith('{')) {
                    szallitasiAdatok = JSON.parse(order.szallitasi_cim);
                    // Formázott szállítási cím összeállítása
                    if (szallitasiAdatok.szallitasiCim) {
                        const cim = szallitasiAdatok.szallitasiCim;
                        szallitasiCim = `${cim.iranyitoszam || ""} ${cim.varos || ""}, ${cim.utca || ""} ${cim.hazszam || ""}`;
                    }
                }
            } catch (error) {
                console.error('Hiba a szállítási cím feldolgozásakor:', error);
            }
            
            // Összeállítjuk a rendelés adatait a tételekkel együtt
            return {
                ...order,
                szallitasi_cim: szallitasiCim,
                termekek: items || []
            };
        }));
        
        res.json(ordersWithItems);
    } catch (error) {
        console.error('Hiba a rendelések lekérésekor email alapján:', error);
        res.status(500).json({
            message: "Hiba történt a rendelések lekérésekor.",
            error: error.message
        });
    }
};

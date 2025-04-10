const mysql = require('mysql2');
require('dotenv').config();

// Create MySQL pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'webshop_project',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

// Statisztikák lekérése
exports.getStats = async (req, res) => {
    try {
        // Get product count
        const [productRows] = await pool.query('SELECT COUNT(*) as count FROM termekek WHERE aktiv = 1');
        const productCount = productRows[0].count;

        // Get order count
        const [orderRows] = await pool.query('SELECT COUNT(*) as count FROM rendelesek');
        const orderCount = orderRows[0].count;

        // Get user count
        const [userRows] = await pool.query('SELECT COUNT(*) as count FROM felhasznalok');
        const userCount = userRows[0].count;
        
        // Get total revenue
        const [orders] = await pool.query(`
            SELECT r.id, rt.mennyiseg, t.ar
            FROM rendelesek r
            JOIN rendeles_tetelek rt ON r.id = rt.rendeles_id
            JOIN termekek t ON rt.termek_id = t.id
        `);
        
        const totalRevenue = orders.reduce((total, order) => {
            return total + (order.mennyiseg * order.ar);
        }, 0);

        res.json({
            productCount,
            orderCount,
            userCount,
            totalRevenue
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).send({
            message: 'Hiba történt a statisztikák lekérése során.'
        });
    }
};

// Termékek listázása
exports.getProducts = async (req, res) => {
    try {
        const [products] = await pool.query(`
            SELECT 
                id,
                nev,
                leiras,
                ar,
                akcios_ar,
                keszlet,
                kategoria_id,
                kep,
                aktiv,
                kiszereles,
                akcios,
                akcio_kezdete,
                akcio_vege,
                hivatkozas,
                tizennyolc_plusz
            FROM termekek
            WHERE aktiv = 1
            ORDER BY id DESC
        `);
        res.json(products);
    } catch (error) {
        console.error('Error getting products:', error);
        res.status(500).send({
            message: 'Hiba történt a termékek lekérése során.'
        });
    }
};

// Termék módosítása
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            nev, 
            leiras, 
            ar, 
            akcios_ar, 
            keszlet, 
            kategoria_id,
            kep,
            kiszereles,
            akcios,
            akcio_kezdete,
            akcio_vege,
            hivatkozas,
            tizennyolc_plusz
        } = req.body;

        // Check if product exists
        const [products] = await pool.query('SELECT * FROM termekek WHERE id = ? AND aktiv = 1', [id]);
        if (products.length === 0) {
            return res.status(404).send({
                message: 'A termék nem található.'
            });
        }

        // Update product
        await pool.query(`
            UPDATE termekek 
            SET nev = ?, 
                leiras = ?, 
                ar = ?, 
                akcios_ar = ?, 
                keszlet = ?, 
                kategoria_id = ?,
                kep = ?,
                kiszereles = ?,
                akcios = ?,
                akcio_kezdete = ?,
                akcio_vege = ?,
                hivatkozas = ?,
                tizennyolc_plusz = ?
            WHERE id = ?
        `, [
            nev, 
            leiras, 
            ar, 
            akcios_ar, 
            keszlet, 
            kategoria_id,
            kep,
            kiszereles,
            akcios,
            akcio_kezdete,
            akcio_vege,
            hivatkozas,
            tizennyolc_plusz,
            id
        ]);

        // Get updated product
        const [updatedProducts] = await pool.query('SELECT * FROM termekek WHERE id = ?', [id]);
        const product = updatedProducts[0];

        res.json({
            message: 'A termék sikeresen frissítve.',
            product
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send({
            message: 'Hiba történt a termék frissítése során.'
        });
    }
};

// Termék törlése (soft delete)
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if product exists
        const [products] = await pool.query('SELECT * FROM termekek WHERE id = ? AND aktiv = 1', [id]);
        if (products.length === 0) {
            return res.status(404).send({
                message: 'A termék nem található.'
            });
        }

        // Soft delete the product
        await pool.query('UPDATE termekek SET aktiv = 0 WHERE id = ?', [id]);

        res.json({
            message: 'A termék sikeresen törölve.'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send({
            message: 'Hiba történt a termék törlése során.'
        });
    }
};

// Termék létrehozása
exports.createProduct = async (req, res) => {
    try {
        const { 
            nev, 
            leiras, 
            ar, 
            akcios_ar, 
            keszlet, 
            kategoria_id,
            kep,
            kiszereles,
            akcios,
            akcio_kezdete,
            akcio_vege,
            hivatkozas,
            tizennyolc_plusz
        } = req.body;

        const [result] = await pool.query(`
            INSERT INTO termekek (
                nev, 
                leiras, 
                ar, 
                akcios_ar, 
                keszlet, 
                kategoria_id,
                kep,
                kiszereles,
                akcios,
                akcio_kezdete,
                akcio_vege,
                hivatkozas,
                tizennyolc_plusz,
                aktiv
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        `, [
            nev, 
            leiras, 
            ar, 
            akcios_ar, 
            keszlet, 
            kategoria_id,
            kep,
            kiszereles,
            akcios,
            akcio_kezdete,
            akcio_vege,
            hivatkozas,
            tizennyolc_plusz
        ]);

        const [newProduct] = await pool.query('SELECT * FROM termekek WHERE id = ?', [result.insertId]);

        res.status(201).json({
            message: 'A termék sikeresen létrehozva.',
            product: newProduct[0]
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).send({
            message: 'Hiba történt a termék létrehozása során.'
        });
    }
};

// Rendelések listázása
exports.getOrders = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        
        // Debug log
        console.log('Fetching orders from database...');
        
        // Egyszerűsített lekérdezés, csak a létező oszlopokkal
        let query = `
            SELECT 
                r.id,
                r.felhasznalo_id,
                r.rendeles_szam,
                r.osszeg,
                r.statusz as allapot,
                r.szallitasi_cim,
                r.megjegyzes,
                r.letrehozva as datum,
                r.modositva,
                f.email,
                f.telefon,
                f.vezeteknev,
                f.keresztnev,
                CONCAT(f.vezeteknev, ' ', f.keresztnev) as felhasznalo_nev
            FROM 
                rendelesek r
            LEFT JOIN 
                felhasznalok f ON r.felhasznalo_id = f.id
            ORDER BY 
                r.letrehozva DESC
        `;
        
        if (limit) {
            query += ` LIMIT ${limit}`;
        }
        
        console.log('SQL Query:', query);
        
        try {
            const [orders] = await pool.execute(query);
            console.log('Orders fetched:', orders ? orders.length : 0);
            
            // Formázzuk az adatokat a frontend számára, feldolgozzuk a JSON adatokat
            const formattedOrders = orders.map(order => {
                try {
                    // Próbáljuk meg feldolgozni a szállítási cím JSON-t
                    let szallitasiAdatok = {};
                    let szallitasiNev = "";
                    let szallitasiCim = "";
                    let szallitasiTelefon = "";
                    let szallitasiEmail = "";
                    let megjegyzes = order.megjegyzes || "";

                    // Felhasználó neve az adatbázisból - csak ha nem admin
                    let dbFelhasznaloNev = "";
                    if (order.felhasznalo_nev && !order.felhasznalo_nev.includes("Admin")) {
                        dbFelhasznaloNev = order.felhasznalo_nev;
                    }

                    if (order.szallitasi_cim) {
                        try {
                            // Próbáljuk meg parse-olni a JSON-t
                            const szallitasiJson = JSON.parse(order.szallitasi_cim);
                            szallitasiAdatok = szallitasiJson;
                            
                            // Kinyerjük a szállítási nevet
                            szallitasiNev = szallitasiJson.nev || "";
                            
                            // Kinyerjük a telefonszámot
                            szallitasiTelefon = szallitasiJson.telefon || order.telefon || "";
                            
                            // Kinyerjük az email címet
                            szallitasiEmail = szallitasiJson.email || order.email || "";
                            
                            // Kinyerjük a megjegyzést, ha van
                            if (szallitasiJson.megjegyzes && !megjegyzes) {
                                megjegyzes = szallitasiJson.megjegyzes;
                            }
                            
                            // Összeállítjuk a formázott címet
                            if (szallitasiJson.szallitasiCim) {
                                const cim = szallitasiJson.szallitasiCim;
                                szallitasiCim = `${cim.iranyitoszam || ""} ${cim.varos || ""}, ${cim.utca || ""} ${cim.hazszam || ""}`;
                                if (cim.megye) {
                                    szallitasiCim += ` (${cim.megye} megye)`;
                                }
                            }
                        } catch (jsonError) {
                            console.error('Error parsing szallitasi_cim JSON:', jsonError);
                            szallitasiCim = order.szallitasi_cim;
                        }
                    }
                    
                    // Mindig a szállítási JSON-ból vett nevet használjuk, ha létezik
                    // Csak akkor használjuk az adatbázis nevet, ha nem admin és nincs szállítási név
                    let displayName = szallitasiNev;
                    if ((!displayName || displayName.trim() === "") && dbFelhasznaloNev) {
                        displayName = dbFelhasznaloNev;
                    }
                    
                    // Ha mindig nincs név, de van email, akkor az email-t használjuk
                    if ((!displayName || displayName.trim() === "" || displayName.includes("Admin")) && szallitasiEmail) {
                        // Kinyerjük a felhasználónevet az email-ből (@ előtti rész)
                        const emailUsername = szallitasiEmail.split('@')[0];
                        displayName = emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1);
                    }

                    return {
                        ...order,
                        vegosszeg: order.osszeg || 0,
                        fizetesi_mod: "Bankkártya",
                        // Feltöltjük a felhasználó nevet a kinyert névvel
                        felhasznalo_nev: displayName,
                        // Hiányzó mezők alapértelmezett értékekkel
                        szamlazasi_nev: displayName,
                        szamlazasi_cim: szallitasiCim,
                        szallitasi_nev: displayName,
                        szallitasi_cim: szallitasiCim,
                        adoszam: "",
                        telefon: szallitasiTelefon || order.telefon || "",
                        email: szallitasiEmail || order.email || "",
                        megjegyzes: megjegyzes,
                        szallitasi_adatok: szallitasiAdatok, // Teljes JSON adatok is elmentve
                        // Formázzuk a dátumokat
                        datum: order.datum ? new Date(order.datum).toISOString() : null,
                        modositva: order.modositva ? new Date(order.modositva).toISOString() : null
                    };
                } catch (err) {
                    console.error('Error formatting order:', err, 'Order data:', order);
                    return null;
                }
            });
            
            res.json(formattedOrders.filter(Boolean));
        } catch (err) {
            console.error('Error fetching orders:', err);
            res.status(500).json({
                message: 'Hiba történt a rendelések lekérdezése során',
                error: err.message
            });
        }
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({
            message: 'Hiba történt a rendelések lekérdezése során',
            error: err.message
        });
    }
};

// Rendelés tételeinek lekérése
exports.getOrderItems = async (req, res) => {
    try {
        const orderId = req.params.id;
        
        console.log(`Fetching order items for order ID: ${orderId}`);
        
        const query = `
            SELECT 
                rt.id,
                rt.termek_id,
                rt.mennyiseg,
                rt.egysegar,
                t.nev as termek_nev
            FROM 
                rendeles_tetelek rt
            JOIN 
                termekek t ON rt.termek_id = t.id
            WHERE 
                rt.rendeles_id = ?
        `;
        
        console.log('SQL Query:', query, [orderId]);
        
        const [items] = await pool.execute(query, [orderId]);
        
        console.log(`Order items fetched for order ${orderId}:`, items ? items.length : 0);
        
        res.json(items);
    } catch (err) {
        console.error(`Error fetching order items for order ${req.params.id}:`, err);
        res.status(500).json({
            message: 'Hiba történt a rendelés tételeinek lekérdezése során'
        });
    }
};

// Rendelés státuszának frissítése
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { allapot } = req.body;
        
        // Konvertáljuk a frontend státuszt az adatbázis formátumára
        let dbStatus;
        switch (allapot) {
            case 'feldolgozas_alatt':
                dbStatus = 'feldolgozás alatt';
                break;
            case 'szallitas_alatt':
                dbStatus = 'szállítás alatt';
                break;
            case 'teljesitve':
                dbStatus = 'teljesítve';
                break;
            case 'torolve':
                dbStatus = 'törölve';
                break;
            default:
                dbStatus = 'új';
        }
        
        await pool.query(
            'UPDATE rendelesek SET statusz = ? WHERE id = ?',
            [dbStatus, id]
        );
        
        res.json({ message: 'Rendelés státusza sikeresen frissítve' });
    } catch (err) {
        console.error('Error updating order status:', err);
        res.status(500).json({
            message: 'Hiba történt a rendelés státuszának frissítése során'
        });
    }
};

// Kategóriák lekérése
exports.getCategories = async (req, res) => {
    try {
        const [categories] = await pool.query('SELECT * FROM kategoriak WHERE aktiv = 1 ORDER BY nev');
        res.json(categories);
    } catch (error) {
        console.error('Error getting categories:', error);
        res.status(500).send({
            message: 'Hiba történt a kategóriák lekérése során.'
        });
    }
};

// Felhasználók listázása
exports.getUsers = async (req, res) => {
    try {
        const [users] = await pool.query(`
            SELECT 
                id,
                email,
                vezeteknev,
                keresztnev,
                szerepkor,
                telefon,
                DATE_FORMAT(letrehozva, '%Y-%m-%d') as letrehozva,
                DATE_FORMAT(utolso_belepes, '%Y-%m-%d %H:%i:%s') as utolso_belepes
            FROM felhasznalok
            WHERE aktiv = 1
            ORDER BY letrehozva DESC
        `);
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Hiba történt a felhasználók lekérdezése során' });
    }
};

// Felhasználó módosítása
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { vezeteknev, keresztnev, email, telefon, szerepkor } = req.body;

        // Ellenőrizzük, hogy létezik-e a felhasználó
        const [users] = await pool.query(
            'SELECT * FROM felhasznalok WHERE id = ? AND aktiv = 1',
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: 'A felhasználó nem található'
            });
        }

        // Ellenőrizzük, hogy az email cím nem foglalt-e más felhasználó által
        const [existingUsers] = await pool.query(
            'SELECT * FROM felhasznalok WHERE email = ? AND id != ? AND aktiv = 1',
            [email, id]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                message: 'Ez az email cím már foglalt'
            });
        }

        // Frissítjük a felhasználó adatait
        await pool.query(
            `UPDATE felhasznalok 
             SET vezeteknev = ?, keresztnev = ?, email = ?, telefon = ?, szerepkor = ?
             WHERE id = ?`,
            [vezeteknev, keresztnev, email, telefon, szerepkor, id]
        );

        // Lekérjük a frissített felhasználó adatait
        const [updatedUser] = await pool.query(
            `SELECT id, email, vezeteknev, keresztnev, szerepkor, telefon,
             DATE_FORMAT(letrehozva, '%Y-%m-%d') as letrehozva,
             DATE_FORMAT(utolso_belepes, '%Y-%m-%d %H:%i:%s') as utolso_belepes
             FROM felhasznalok WHERE id = ?`,
            [id]
        );

        res.json({
            message: 'A felhasználó sikeresen frissítve',
            user: updatedUser[0]
        });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({
            message: 'Hiba történt a felhasználó módosítása során'
        });
    }
};

// Felhasználó törlése (soft delete)
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Ellenőrizzük, hogy létezik-e a felhasználó
        const [users] = await pool.query(
            'SELECT * FROM felhasznalok WHERE id = ? AND aktiv = 1',
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: 'A felhasználó nem található'
            });
        }

        // Soft delete - csak az aktív mezőt állítjuk 0-ra
        await pool.query(
            'UPDATE felhasznalok SET aktiv = 0 WHERE id = ?',
            [id]
        );

        res.json({
            message: 'A felhasználó sikeresen törölve',
            id: id
        });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({
            message: 'Hiba történt a felhasználó törlése során'
        });
    }
};

// Legnépszerűbb termékek lekérése
exports.getTopProducts = async (req, res) => {
    try {
        // Lekérjük a legtöbbet rendelt termékeket
        const [products] = await pool.query(`
            SELECT 
                t.id, 
                t.nev, 
                t.ar, 
                t.keszlet,
                COALESCE(SUM(rt.mennyiseg), 0) as eladasok
            FROM 
                termekek t
            LEFT JOIN 
                rendeles_tetelek rt ON t.id = rt.termek_id
            WHERE 
                t.aktiv = 1
            GROUP BY 
                t.id
            ORDER BY 
                eladasok DESC
            LIMIT 5
        `);

        res.json(products);
    } catch (err) {
        console.error('Error fetching top products:', err);
        res.status(500).json({
            message: 'Hiba történt a legnépszerűbb termékek lekérdezése során'
        });
    }
};

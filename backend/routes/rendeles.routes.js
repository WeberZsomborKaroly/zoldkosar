const express = require('express');
const router = express.Router();
const db = require('../models');
const authJwt = require('../middleware/authJwt');
const Rendeles = db.rendeles;
const RendelesTetel = db.rendelesTetel;
const Felhasznalo = db.felhasznalo;


router.post('/szallitasi-adatok', [authJwt.verifyToken], async (req, res) => {
    try {
        const felhasznaloId = req.userId;
        const szallitasiAdatok = req.body;

        
        await Felhasznalo.update(
            {
                szallitasi_adatok: JSON.stringify(szallitasiAdatok)
            },
            {
                where: { id: felhasznaloId }
            }
        );

        res.json({ uzenet: 'Szállítási adatok sikeresen mentve!' });
    } catch (error) {
        console.error('Hiba a szállítási adatok mentésekor:', error);
        res.status(500).json({ uzenet: 'Szerver hiba' });
    }
});


router.post('/', [authJwt.verifyToken], async (req, res) => {
    const t = await db.sequelize.transaction();

    try {
        console.log("Rendelés adatok beérkeztek:", JSON.stringify(req.body));
        const { vevoAdatok, termekek, vegosszeg } = req.body;
        const felhasznaloId = req.userId || 1; 

       
        if (!vevoAdatok || !termekek || !vegosszeg) {
            console.error("Hiányzó adatok a rendelésnél.");
            return res.status(400).json({
                uzenet: "Hiányzó adatok! Kérjük adja meg a vevő adatait, a termékeket és a végösszeget."
            });
        }

        
        const rendeles = await Rendeles.create({
            felhasznalo_id: felhasznaloId,
            osszeg: vegosszeg,
            szallitasi_cim: JSON.stringify(vevoAdatok),
            statusz: 'feldolgozas_alatt'
        }, { transaction: t });
        
        console.log("Rendelés létrehozva:", rendeles.id);

        
        const rendelesTetelekPromises = termekek.map(tetel => {
            console.log("Tétel feldolgozása:", tetel);
            return RendelesTetel.create({
                rendeles_id: rendeles.id,
                termek_id: tetel.termek_id,
                mennyiseg: tetel.mennyiseg,
                egysegar: tetel.ar
            }, { transaction: t });
        });

        await Promise.all(rendelesTetelekPromises);
        console.log("Rendelési tételek létrehozva");

        // Kosár ürítése
        await db.kosar.destroy({
            where: { felhasznalo_id: felhasznaloId },
            transaction: t
        });
        console.log("Kosár kiürítve");

        await t.commit();
        console.log("Tranzakció sikeresen lezárva");

        res.json({
            uzenet: 'Rendelés sikeresen létrehozva!',
            rendeles_id: rendeles.id
        });
    } catch (error) {
        await t.rollback();
        console.error('Hiba a rendelés létrehozásakor:', error);
        res.status(500).json({ uzenet: 'Hiba történt a rendelés feldolgozása során' });
    }
});

// Rendelés létrehozása
router.post('/uj', [authJwt.verifyToken], async (req, res) => {
    const t = await db.sequelize.transaction();

    try {
        console.log("Rendelés adatok beérkeztek:", JSON.stringify(req.body));
        const { szallitasiAdatok, termekek, vegosszeg } = req.body;
        const felhasznaloId = req.userId;

        
        if (!szallitasiAdatok || !termekek || !vegosszeg) {
            console.error("Hiányzó adatok a rendelésnél.");
            return res.status(400).json({
                uzenet: "Hiányzó adatok! Kérjük adja meg a szállítási adatokat, a termékeket és a végösszeget."
            });
        }

        // Rendelés létrehozása
        const rendeles = await Rendeles.create({
            felhasznalo_id: felhasznaloId,
            osszeg: vegosszeg,
            szallitasi_cim: JSON.stringify(szallitasiAdatok),
            statusz: 'feldolgozas_alatt'
        }, { transaction: t });
        
        console.log("Rendelés létrehozva:", rendeles.id);

        
        const rendelesTetelekPromises = termekek.map(tetel => {
            console.log("Tétel feldolgozása:", tetel);
            return RendelesTetel.create({
                rendeles_id: rendeles.id,
                termek_id: tetel.termek_id,
                mennyiseg: tetel.mennyiseg,
                egysegar: tetel.ar
            }, { transaction: t });
        });

        await Promise.all(rendelesTetelekPromises);
        console.log("Rendelési tételek létrehozva");

        
        await db.kosar.destroy({
            where: { felhasznalo_id: felhasznaloId },
            transaction: t
        });
        console.log("Kosár kiürítve");

        await t.commit();
        console.log("Tranzakció sikeresen lezárva");

        res.json({
            uzenet: 'Rendelés sikeresen létrehozva!',
            rendeles_id: rendeles.id
        });
    } catch (error) {
        await t.rollback();
        console.error('Hiba a rendelés létrehozásakor:', error);
        res.status(500).json({ uzenet: 'Hiba történt a rendelés feldolgozása során' });
    }
});

router.get('/sajat', [authJwt.verifyToken], async (req, res) => {
    try {
        const rendelesek = await Rendeles.findAll({
            where: { felhasznalo_id: req.userId },
            include: [{
                model: RendelesTetel,
                include: [{
                    model: db.termek,
                    attributes: ['nev', 'ar', 'kep']
                }]
            }],
            order: [['createdAt', 'DESC']]
        });

        res.json(rendelesek);
    } catch (error) {
        console.error('Hiba a rendelések lekérésekor:', error);
        res.status(500).json({ uzenet: 'Szerver hiba' });
    }
});

module.exports = router;

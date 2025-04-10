const db = require("../models");
const Kupon = db.Kupon;
const Op = db.Sequelize.Op;

// Új kupon létrehozása
exports.create = async (req, res) => {
    try {
        // Validáció
        if (!req.body.kod || !req.body.tipus || !req.body.ertek || !req.body.lejarat_datum) {
            return res.status(400).send({
                message: "Hiányzó adatok! A kupon kód, típus, érték és lejárati dátum megadása kötelező."
            });
        }

        // Kupon létrehozása
        const kupon = {
            kod: req.body.kod,
            kedvezmeny_tipus: req.body.tipus,
            ertek: parseInt(req.body.ertek),
            minimum_osszeg: parseInt(req.body.minimum_osszeg) || 0,
            ervenyes_kezdete: new Date(),
            ervenyes_vege: new Date(req.body.lejarat_datum),
            aktiv: true,
            felhasznalva: 0
        };

        const data = await Kupon.create(kupon);
        res.status(201).send(data);
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).send({
                message: "Ez a kuponkód már létezik!"
            });
        } else {
            res.status(500).send({
                message: err.message || "Hiba történt a kupon létrehozása közben."
            });
        }
    }
};

// Összes kupon lekérése
exports.findAll = async (req, res) => {
    try {
        const kuponok = await Kupon.findAll({
            order: [['id', 'DESC']]
        });
        res.send(kuponok);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Hiba történt a kuponok lekérése közben."
        });
    }
};

// Kupon törlése
exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        const num = await Kupon.destroy({
            where: { id: id }
        });
        
        if (num === 1) {
            res.send({ message: "A kupon sikeresen törölve lett." });
        } else {
            res.send({ message: "Nem sikerült törölni a kupont. Lehet, hogy nem található." });
        }
    } catch (err) {
        res.status(500).send({
            message: "Hiba történt a kupon törlése közben."
        });
    }
};

// Kupon érvényesítése
exports.validate = async (req, res) => {
    const kod = req.params.kod;
    try {
        const kupon = await Kupon.findOne({
            where: {
                kod: kod,
                aktiv: true,
                ervenyes_vege: {
                    [Op.gte]: new Date()
                }
            }
        });

        if (!kupon) {
            return res.status(404).send({
                message: "A kupon nem található vagy már nem érvényes."
            });
        }

        // Ellenőrizzük a minimum kosárértéket
        const kosarErtek = req.body.kosarErtek || 0;
        if (kosarErtek < kupon.minimum_osszeg) {
            return res.status(400).send({
                message: `A kupon csak ${kupon.minimum_osszeg} Ft feletti vásárlás esetén érvényes.`
            });
        }

        // Kiszámoljuk a kedvezményt
        let kedvezmeny = 0;
        if (kupon.kedvezmeny_tipus === 'fix') {
            kedvezmeny = kupon.ertek;
        } else {
            kedvezmeny = Math.floor(kosarErtek * (kupon.ertek / 100));
        }

        res.send({
            kupon: kupon,
            kedvezmeny: kedvezmeny
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Hiba történt a kupon ellenőrzése közben."
        });
    }
};

// Kupon alkalmazása a kosárra
exports.alkalmaz = async (req, res) => {
    try {
        // Validáció
        if (!req.body.kod || req.body.osszeg === undefined) {
            return res.status(400).send({
                message: "Hiányzó adatok! A kupon kód és a kosár összege kötelező."
            });
        }

        const kod = req.body.kod;
        const osszeg = req.body.osszeg;

        // Kupon keresése
        const kupon = await Kupon.findOne({
            where: {
                kod: kod,
                aktiv: true,
                ervenyes_vege: {
                    [Op.gte]: new Date()
                }
            }
        });

        if (!kupon) {
            return res.status(404).send({
                message: "A kupon nem található vagy már nem érvényes."
            });
        }

        // Ellenőrizzük a minimum kosárértéket
        if (osszeg < kupon.minimum_osszeg) {
            return res.status(400).send({
                message: `A kupon csak ${kupon.minimum_osszeg} Ft feletti vásárlás esetén érvényes.`
            });
        }

        // Kiszámoljuk a kedvezményt
        let kedvezmeny = 0;
        if (kupon.kedvezmeny_tipus === 'fix') {
            kedvezmeny = kupon.ertek;
        } else {
            kedvezmeny = Math.floor(osszeg * (kupon.ertek / 100));
        }

        res.send({
            kupon: kupon,
            kedvezmeny: kedvezmeny
        });
    } catch (err) {
        console.error('Hiba a kupon alkalmazása közben:', err);
        res.status(500).send({
            message: err.message || "Hiba történt a kupon alkalmazása közben."
        });
    }
};

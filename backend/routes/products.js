const express = require('express');
const router = express.Router();
const db = require('../database/db');


router.get('/', async (req, res) => {
    try {
        const [products] = await db.execute(
            'SELECT id, nev as name, ar as price, leiras as description, kep as image, keszlet as stock FROM termekek WHERE aktiv = 1'
        );
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Hiba történt a termékek betöltése közben' });
    }
});

module.exports = router;

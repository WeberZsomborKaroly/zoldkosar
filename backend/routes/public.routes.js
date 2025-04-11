const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
require('dotenv').config();


const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'webshop_project',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();


router.get('/categories', async (req, res) => {
    try {
        const [categories] = await pool.query('SELECT * FROM kategoriak WHERE aktiv = 1 ORDER BY nev');
        res.json(categories);
    } catch (error) {
        console.error('Error getting categories:', error);
        res.status(500).send({
            message: 'Hiba történt a kategóriák lekérése során.'
        });
    }
});


router.get('/products', async (req, res) => {
    try {
        const [products] = await pool.query(`
            SELECT t.*, k.nev as kategoria_nev 
            FROM termekek t
            LEFT JOIN kategoriak k ON t.kategoria_id = k.id
            WHERE t.aktiv = 1
            ORDER BY t.nev
        `);
        res.json(products);
    } catch (error) {
        console.error('Error getting products:', error);
        res.status(500).send({
            message: 'Hiba történt a termékek lekérése során.'
        });
    }
});


router.get('/termekek', async (req, res) => {
    try {
        const [products] = await pool.query(`
            SELECT t.*, k.nev as kategoria_nev 
            FROM termekek t
            LEFT JOIN kategoriak k ON t.kategoria_id = k.id
            WHERE t.aktiv = 1
            ORDER BY t.nev
        `);
        res.json(products);
    } catch (error) {
        console.error('Error getting products:', error);
        res.status(500).send({
            message: 'Hiba történt a termékek lekérése során.'
        });
    }
});


router.get('/products/category/:categoryId', async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const [products] = await pool.query(`
            SELECT t.*, k.nev as kategoria_nev 
            FROM termekek t
            LEFT JOIN kategoriak k ON t.kategoria_id = k.id
            WHERE t.kategoria_id = ? AND t.aktiv = 1
            ORDER BY t.nev
        `, [categoryId]);
        res.json(products);
    } catch (error) {
        console.error('Error getting products by category:', error);
        res.status(500).send({
            message: 'Hiba történt a kategória termékeinek lekérése során.'
        });
    }
});


router.get('/termekek/kategoria/:categoryId', async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const [products] = await pool.query(`
            SELECT t.*, k.nev as kategoria_nev 
            FROM termekek t
            LEFT JOIN kategoriak k ON t.kategoria_id = k.id
            WHERE t.kategoria_id = ? AND t.aktiv = 1
            ORDER BY t.nev
        `, [categoryId]);
        res.json(products);
    } catch (error) {
        console.error('Error getting products by category:', error);
        res.status(500).send({
            message: 'Hiba történt a kategória termékeinek lekérése során.'
        });
    }
});


router.get('/product/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const [products] = await pool.query(`
            SELECT t.*, k.nev as kategoria_nev 
            FROM termekek t
            LEFT JOIN kategoriak k ON t.kategoria_id = k.id
            WHERE t.id = ? AND t.aktiv = 1
        `, [productId]);
        
        if (products.length === 0) {
            return res.status(404).send({
                message: 'A termék nem található.'
            });
        }
        
        res.json(products[0]);
    } catch (error) {
        console.error('Error getting product:', error);
        res.status(500).send({
            message: 'Hiba történt a termék lekérése során.'
        });
    }
});


router.get('/termek/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const [products] = await pool.query(`
            SELECT t.*, k.nev as kategoria_nev 
            FROM termekek t
            LEFT JOIN kategoriak k ON t.kategoria_id = k.id
            WHERE t.id = ? AND t.aktiv = 1
        `, [productId]);
        
        if (products.length === 0) {
            return res.status(404).send({
                message: 'A termék nem található.'
            });
        }
        
        res.json(products[0]);
    } catch (error) {
        console.error('Error getting product:', error);
        res.status(500).send({
            message: 'Hiba történt a termék lekérése során.'
        });
    }
});

module.exports = router;

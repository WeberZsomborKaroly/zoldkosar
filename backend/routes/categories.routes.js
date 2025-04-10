const express = require('express');
const router = express.Router();
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

// Get all categories
router.get('/', async (req, res) => {
    try {
        const [categories] = await pool.query('SELECT * FROM kategoriak ORDER BY nev');
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send({
            message: 'Hiba történt a kategóriák lekérése során.'
        });
    }
});

// Get category by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [categories] = await pool.query('SELECT * FROM kategoriak WHERE id = ?', [id]);
        
        if (categories.length === 0) {
            return res.status(404).send({
                message: 'A kategória nem található.'
            });
        }
        
        res.json(categories[0]);
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).send({
            message: 'Hiba történt a kategória lekérése során.'
        });
    }
});

module.exports = router;

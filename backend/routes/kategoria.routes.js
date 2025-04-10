const express = require('express');
const router = express.Router();
const db = require("../models");
const Kategoria = db.Kategoria;
const { authJwt } = require("../middleware");

// Get all categories
router.get('/', async (req, res) => {
    try {
        const kategoriak = await Kategoria.findAll({
            order: [['nev', 'ASC']]
        });
        res.json(kategoriak);
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
        const kategoria = await Kategoria.findByPk(id);
        
        if (!kategoria) {
            return res.status(404).send({
                message: 'A kategória nem található.'
            });
        }
        
        res.json(kategoria);
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).send({
            message: 'Hiba történt a kategória lekérése során.'
        });
    }
});

// Create a new category (admin only)
router.post('/', [authJwt.verifyToken, authJwt.isAdmin], async (req, res) => {
    try {
        const { nev, szulo_kategoria, hivatkozas, tizennyolc_plusz } = req.body;
        
        // Validate required fields
        if (!nev) {
            return res.status(400).send({
                message: 'A kategória neve kötelező mező!'
            });
        }
        
        // Create new category
        const ujKategoria = await Kategoria.create({
            nev,
            szulo_kategoria: szulo_kategoria || null,
            hivatkozas: hivatkozas || null,
            tizennyolc_plusz: tizennyolc_plusz || false
        });
        
        res.status(201).json({
            message: 'Kategória sikeresen létrehozva!',
            kategoria: ujKategoria
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).send({
            message: 'Hiba történt a kategória létrehozása során.',
            error: error.message
        });
    }
});

// Update a category (admin only)
router.put('/:id', [authJwt.verifyToken, authJwt.isAdmin], async (req, res) => {
    try {
        const { id } = req.params;
        const { nev, szulo_kategoria, hivatkozas, tizennyolc_plusz } = req.body;
        
        // Find the category
        const kategoria = await Kategoria.findByPk(id);
        
        if (!kategoria) {
            return res.status(404).send({
                message: 'A kategória nem található.'
            });
        }
        
        // Validate required fields
        if (!nev) {
            return res.status(400).send({
                message: 'A kategória neve kötelező mező!'
            });
        }
        
        // Update category
        await kategoria.update({
            nev,
            szulo_kategoria: szulo_kategoria || null,
            hivatkozas: hivatkozas || null,
            tizennyolc_plusz: tizennyolc_plusz || false
        });
        
        res.json({
            message: 'Kategória sikeresen frissítve!',
            kategoria
        });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).send({
            message: 'Hiba történt a kategória frissítése során.',
            error: error.message
        });
    }
});

// Delete a category (admin only)
router.delete('/:id', [authJwt.verifyToken, authJwt.isAdmin], async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the category
        const kategoria = await Kategoria.findByPk(id);
        
        if (!kategoria) {
            return res.status(404).send({
                message: 'A kategória nem található.'
            });
        }
        
        // Check if category has child categories
        const childCategories = await Kategoria.findAll({
            where: { szulo_kategoria: id }
        });
        
        if (childCategories.length > 0) {
            return res.status(400).send({
                message: 'A kategória nem törölhető, mert alkategóriákkal rendelkezik!'
            });
        }
        
        // Check if category has products
        const termekek = await db.sequelize.query(
            `SELECT COUNT(*) as count FROM termekek WHERE kategoria_id = ?`,
            {
                replacements: [id],
                type: db.sequelize.QueryTypes.SELECT
            }
        );
        
        if (termekek[0].count > 0) {
            return res.status(400).send({
                message: 'A kategória nem törölhető, mert termékek tartoznak hozzá!'
            });
        }
        
        // Delete category
        await kategoria.destroy();
        
        res.json({
            message: 'Kategória sikeresen törölve!'
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).send({
            message: 'Hiba történt a kategória törlése során.',
            error: error.message
        });
    }
});

module.exports = router;

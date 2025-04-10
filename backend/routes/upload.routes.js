const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Konfiguráljuk a multer tárolót
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads/products');
        
        // Ellenőrizzük, hogy létezik-e a könyvtár, ha nem, létrehozzuk
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Egyedi fájlnév generálása az eredeti fájlnév és időbélyeg alapján
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExt = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExt);
    }
});

// Csak képfájlok engedélyezése
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Csak képfájlok tölthetők fel!'), false);
    }
};

// Inicializáljuk a multer feltöltőt
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB méretkorlátozás
    }
});

// Képfeltöltési végpont
router.post('/product-image', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Nincs feltöltött fájl' });
        }
        
        // A feltöltött fájl elérési útja
        const filePath = `/uploads/products/${req.file.filename}`;
        
        return res.status(200).json({ 
            message: 'A kép sikeresen feltöltve',
            filePath: filePath,
            fileName: req.file.filename
        });
    } catch (error) {
        console.error('Hiba a képfeltöltés során:', error);
        return res.status(500).json({ message: 'Hiba a képfeltöltés során', error: error.message });
    }
});

module.exports = router;

const jwt = require('jsonwebtoken');
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
});

// Convert pool to use promises
const promisePool = pool.promise();

const verifyToken = async (req, res, next) => {
    let token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send({
            message: 'Nincs megadva token!'
        });
    }

    // Remove 'Bearer ' from token string if present
    token = token.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'webshop-secret-key');
        req.userId = decoded.id;

        // Check if user exists and is active
        const [users] = await promisePool.query(
            'SELECT * FROM felhasznalok WHERE id = ? AND aktiv = 1',
            [decoded.id]
        );

        if (users.length === 0) {
            return res.status(401).send({
                message: 'Felhasználó nem található vagy inaktív!'
            });
        }

        // Attach user to request object
        req.user = users[0];
        
        // Add debug log
        console.log(`Sikeres token ellenőrzés: Felhasználó ID=${req.userId}, Szerepkör=${req.user.szerepkor}`);
        
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(401).send({
            message: 'Érvénytelen token!'
        });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        // User should be attached by verifyToken middleware
        if (!req.user) {
            return res.status(401).send({
                message: 'Nincs bejelentkezett felhasználó!'
            });
        }

        if (req.user.szerepkor !== 'admin') {
            return res.status(403).send({
                message: 'Admin jogosultság szükséges!'
            });
        }
        
        // Add debug log
        console.log(`Admin jogosultság ellenőrzés sikeres: Felhasználó ID=${req.userId}`);

        next();
    } catch (error) {
        console.error('Admin verification error:', error);
        res.status(500).send({
            message: 'Hiba történt a jogosultság ellenőrzése során!'
        });
    }
};

module.exports = {
    verifyToken,
    isAdmin
};

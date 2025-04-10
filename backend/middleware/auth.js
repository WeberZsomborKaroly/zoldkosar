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
}).promise();

const verifyToken = async (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(403).json({ message: "Nincs token megadva!" });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET || 'webshop-secret-key');
        
        // Fetch user from database to ensure it exists and is active
        const [users] = await pool.query(
            'SELECT * FROM felhasznalok WHERE id = ? AND aktiv = 1',
            [decoded.id]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ message: "Felhasználó nem található vagy inaktív!" });
        }
        
        // Set the complete user object
        req.user = users[0];
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({ message: "Érvénytelen token!" });
    }
};

module.exports = {
    verifyToken
};

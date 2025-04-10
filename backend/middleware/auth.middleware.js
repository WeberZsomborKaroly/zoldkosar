const jwt = require('jsonwebtoken');
const db = require('../models');
const authConfig = require('../config/auth.config');

const verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send({
            message: 'Nincs megadva token!'
        });
    }

    // Remove 'Bearer ' from token string
    token = token.replace('Bearer ', '');

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: 'Jogosulatlan!'
            });
        }
        req.userId = decoded.id;
        next();
    });
};

const verifyAdmin = async (req, res, next) => {
    try {
        const user = await db.felhasznalo.findByPk(req.userId);
        
        if (!user) {
            return res.status(404).send({
                message: 'Felhasználó nem található!'
            });
        }

        if (user.szerepkor !== 'admin') {
            return res.status(403).send({
                message: 'Admin jogosultság szükséges!'
            });
        }

        next();
    } catch (error) {
        res.status(500).send({
            message: 'Hiba történt a jogosultság ellenőrzése során!'
        });
    }
};

module.exports = {
    verifyToken,
    verifyAdmin
};

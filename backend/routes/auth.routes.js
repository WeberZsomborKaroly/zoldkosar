const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');


const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'webshop_project',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};


const pool = mysql.createPool(dbConfig);


const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false, // TLS
    auth: {
        user: "Zsombor545@outlook.com", // Cseréld le a saját Outlook címedre
        pass: "Zsombota098" // Cseréld le a saját jelszavadra
    },
    tls: {
        ciphers: 'SSLv3'
    }
});


const sendConfirmationEmail = async (user) => {
    try {
        const mailOptions = {
            from: 'te_email_címed@outlook.com', 
            to: user.email,
            subject: 'Sikeres regisztráció - Webshop',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h2 style="color: #333;">Üdvözöljük a Webshopban!</h2>
                    <p>Kedves ${user.vezeteknev} ${user.keresztnev},</p>
                    <p>Köszönjük, hogy regisztrált webshopunkban!</p>
                    <p>Az Ön regisztrációs adatai:</p>
                    <ul>
                        <li><strong>Email:</strong> ${user.email}</li>
                        <li><strong>Név:</strong> ${user.vezeteknev} ${user.keresztnev}</li>
                    </ul>
                    <p>Mostantól bejelentkezhet és vásárolhat webshopunkban.</p>
                    <p>Üdvözlettel,<br>A Webshop Csapata</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email elküldve: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Hiba az email küldése során:', error);
        return false;
    }
};

// Regisztráció
router.post('/signup', async (req, res) => {
    try {
        const { email, jelszo, vezeteknev, keresztnev, telefon } = req.body;

        
        const [existingUsers] = await pool.query(
            'SELECT id FROM felhasznalok WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                message: 'Ez az email cím már regisztrálva van!'
            });
        }

        
        const hashedPassword = await bcrypt.hash(jelszo, 8);

       
        const [result] = await pool.query(
            'INSERT INTO felhasznalok (email, jelszo, szerepkor, vezeteknev, keresztnev, telefon, aktiv) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [email, hashedPassword, 'user', vezeteknev, keresztnev, telefon, true]
        );

        
        const [users] = await pool.query(
            'SELECT id, email, szerepkor, vezeteknev, keresztnev FROM felhasznalok WHERE id = ?',
            [result.insertId]
        );

        const user = users[0];

        // Email küldése
        await sendConfirmationEmail({
            email: user.email,
            vezeteknev: user.vezeteknev,
            keresztnev: user.keresztnev
        });

        res.status(201).json({
            message: 'Sikeres regisztráció! Visszaigazoló email elküldve.',
            user: {
                id: user.id,
                email: user.email,
                szerepkor: user.szerepkor,
                vezeteknev: user.vezeteknev,
                keresztnev: user.keresztnev
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: 'Hiba történt a regisztráció során.',
            error: error.message
        });
    }
});

// Bejelentkezés
router.post('/signin', async (req, res) => {
    try {
        const { email, jelszo } = req.body;

        
        const [users] = await pool.query(
            'SELECT * FROM felhasznalok WHERE email = ? AND aktiv = 1',
            [email]
        );
        
        if (users.length === 0) {
            return res.status(404).json({
                message: 'Felhasználó nem található!'
            });
        }

        const user = users[0];

        
        const validPassword = await bcrypt.compare(jelszo, user.jelszo);
        if (!validPassword) {
            return res.status(401).json({
                message: 'Helytelen jelszó!'
            });
        }

        
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET || 'webshop-secret-key',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Sikeres bejelentkezés!',
            user: {
                id: user.id,
                email: user.email,
                szerepkor: user.szerepkor,
                vezeteknev: user.vezeteknev,
                keresztnev: user.keresztnev
            },
            accessToken: token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Hiba történt a bejelentkezés során.',
            error: error.message
        });
    }
});

module.exports = router;

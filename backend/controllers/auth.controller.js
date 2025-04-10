const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

exports.login = async (req, res) => {
    try {
        const { email, jelszo } = req.body;
        console.log('Login attempt for:', email);

        // Adatbázis kapcsolat létrehozása
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'webshop_project'
        });

        // Felhasználó keresése
        const [users] = await connection.execute(
            'SELECT * FROM felhasznalok WHERE email = ?',
            [email]
        );

        console.log('Found users:', users);

        if (users.length === 0) {
            await connection.end();
            return res.status(401).json({
                message: "Hibás email cím vagy jelszó!"
            });
        }

        const user = users[0];
        console.log('User data:', { ...user, jelszo: '[HIDDEN]' });

        // Jelszó ellenőrzése
        const validPassword = await bcrypt.compare(jelszo, user.jelszo);
        console.log('Password valid:', validPassword);

        if (!validPassword) {
            await connection.end();
            return res.status(401).json({
                message: "Hibás email cím vagy jelszó!"
            });
        }

        // Utolsó belépés idejének frissítése
        await connection.execute(
            'UPDATE felhasznalok SET utolso_belepes = NOW() WHERE id = ?',
            [user.id]
        );
        console.log('Updated last login time for user:', user.id);

        // Token generálása
        const tokenPayload = { 
            id: user.id,
            email: user.email,
            szerepkor: user.szerepkor 
        };
        console.log('Token payload:', tokenPayload);

        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET || 'webshop-secret-key',
            { expiresIn: '24h' }
        );

        // Kapcsolat bezárása
        await connection.end();

        const responseData = {
            token,
            user: {
                id: user.id,
                email: user.email,
                vezeteknev: user.vezeteknev,
                keresztnev: user.keresztnev,
                szerepkor: user.szerepkor
            }
        };
        console.log('Response data:', { ...responseData, token: '[HIDDEN]' });

        // Válasz küldése
        res.status(200).json(responseData);

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: "Hiba történt a bejelentkezés során!"
        });
    }
};

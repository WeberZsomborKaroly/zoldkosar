require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');

const app = express();


app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
app.use('/kepek', express.static(path.join(__dirname, 'public', 'kepek')));


const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'webshop_project',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};


const pool = mysql.createPool(dbConfig).promise();


async function testConnection() {
    try {
        await pool.query('SELECT 1');
        console.log('Successfully connected to XAMPP MySQL database');
        console.log('Using database config:', {
            host: dbConfig.host,
            user: dbConfig.user,
            database: dbConfig.database,
            port: dbConfig.port
        });
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
}


const publicRoutes = require('./routes/public.routes');
const rendelesRoutes = require('./routes/rendeles.routes');
const categoriesRoutes = require('./routes/categories.routes');
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat');
const newOrderRoutes = require('./routes/new-order.routes');
const adminRoutes = require('./routes/admin.routes');
const kategoriaRoutes = require('./routes/kategoria.routes');
const uploadRoutes = require('./routes/upload.routes');


app.use('/api', publicRoutes);
app.use('/api/rendeles', rendelesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/orders', newOrderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/kategoriak', kategoriaRoutes);
app.use('/api/upload', uploadRoutes);


require('./routes/kosar.routes')(app);


require('./routes/termek.routes')(app);


require('./routes/kupon.routes')(app);

app.post('/api/bejelentkezes', async (req, res) => {
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
            { id: user.id, szerepkor: user.szerepkor },
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


app.get('/api/check-image/:imagePath', async (req, res) => {
    try {
        const imagePath = req.params.imagePath;
        const fullPath = path.join(__dirname, 'public', 'kepek', 'Products', imagePath);
        
        if (fs.existsSync(fullPath)) {
            res.json({ exists: true, path: `/kepek/Products/${imagePath}` });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        console.error('Error checking image:', error);
        res.status(500).json({ error: 'Error checking image' });
    }
});


async function initializeServer() {
    try {
        await testConnection();
        const port = process.env.PORT || 3001;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to initialize server:', error);
        process.exit(1);
    }
}

initializeServer();

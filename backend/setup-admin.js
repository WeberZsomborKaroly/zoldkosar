const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
require('dotenv').config();


const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'webshop_project',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};


const pool = mysql.createPool(dbConfig).promise();

async function setupAdmin() {
    try {
       
        await pool.query(`
            CREATE TABLE IF NOT EXISTS felhasznalok (
                id INT PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(255) NOT NULL UNIQUE,
                jelszo VARCHAR(255) NOT NULL,
                vezeteknev VARCHAR(100),
                keresztnev VARCHAR(100),
                telefon VARCHAR(20),
                szerepkor VARCHAR(20) DEFAULT 'user',
                aktiv TINYINT(1) DEFAULT 1
            )
        `);
        console.log('Users table created or already exists');

       
        const [admins] = await pool.query('SELECT * FROM felhasznalok WHERE szerepkor = "admin"');
        
        if (admins.length === 0) {
            
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await pool.query(`
                INSERT INTO felhasznalok 
                (email, jelszo, vezeteknev, keresztnev, telefon, szerepkor) 
                VALUES 
                (?, ?, ?, ?, ?, ?)
            `, ['admin@webshop.com', hashedPassword, 'Admin', 'User', '+36123456789', 'admin']);
            console.log('Admin user created');
        } else {
            console.log('Admin user already exists');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error setting up admin:', error);
        process.exit(1);
    }
}

setupAdmin();

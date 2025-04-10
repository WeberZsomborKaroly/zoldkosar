const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'webshop_project'
        });

        const adminData = {
            email: 'admin@webshop.com',
            password: 'admin123',
            vezeteknev: 'Admin',
            keresztnev: 'User',
            telefon: '123456789',
            szerepkor: 'admin',
            email_megerositva: 1,
            aktiv: 1
        };

        // Hash the password
        const hashedPassword = await bcrypt.hash(adminData.password, 10);

        // Check if admin already exists
        const [existingAdmin] = await connection.execute(
            'SELECT * FROM felhasznalok WHERE email = ?',
            [adminData.email]
        );

        if (existingAdmin.length > 0) {
            console.log('Admin user already exists');
            await connection.end();
            return;
        }

        // Insert admin user
        await connection.execute(
            `INSERT INTO felhasznalok 
            (email, jelszo, vezeteknev, keresztnev, telefon, szerepkor, email_megerositva, aktiv) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                adminData.email,
                hashedPassword,
                adminData.vezeteknev,
                adminData.keresztnev,
                adminData.telefon,
                adminData.szerepkor,
                adminData.email_megerositva,
                adminData.aktiv
            ]
        );

        console.log('Admin user created successfully');
        console.log('Email:', adminData.email);
        console.log('Password:', adminData.password);

        await connection.end();
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
}

createAdmin();

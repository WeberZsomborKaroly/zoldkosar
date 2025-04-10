const bcrypt = require('bcryptjs');
const db = require('./models');

async function initializeDatabase() {
    try {
        // Sync all models with the database
        await db.sequelize.sync({ alter: true });
        console.log('Database synchronized successfully.');

        // Check if admin user exists
        const adminExists = await db.Felhasznalo.findOne({
            where: {
                email: 'admin@example.com',
                szerepkor: 'admin'
            }
        });

        if (!adminExists) {
            // Create admin user
            const hashedPassword = await bcrypt.hash('admin123', 8);
            await db.Felhasznalo.create({
                email: 'admin@example.com',
                jelszo: hashedPassword,
                szerepkor: 'admin',
                vezeteknev: 'Admin',
                keresztnev: 'User',
                aktiv: true
            });
            console.log('Admin user created successfully.');
        } else {
            console.log('Admin user already exists.');
        }

        console.log('Database initialization completed.');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        process.exit();
    }
}

initializeDatabase();

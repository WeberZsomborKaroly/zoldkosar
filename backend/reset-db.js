const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306
};

async function resetDatabase() {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
        // Drop and recreate the database
        await connection.query('DROP DATABASE IF EXISTS webshop_project');
        console.log('Old database dropped');
        
        await connection.query('CREATE DATABASE webshop_project');
        console.log('New database created');
        
        await connection.query('USE webshop_project');
        
        // Create tables in the correct order
        await connection.query(`
            CREATE TABLE kategoria (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nev VARCHAR(255) NOT NULL,
                szulo_kategoria INT,
                hivatkozas VARCHAR(255),
                tizennyolc_plusz BOOLEAN DEFAULT false,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB;
        `);
        console.log('Kategoria table created');

        await connection.query(`
            CREATE TABLE termek (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nev VARCHAR(255) NOT NULL,
                leiras TEXT,
                ar INT NOT NULL,
                kep VARCHAR(255),
                keszlet INT DEFAULT 0,
                kategoria_id INT,
                aktiv BOOLEAN DEFAULT true,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (kategoria_id) REFERENCES kategoria(id)
            ) ENGINE=InnoDB;
        `);
        console.log('Termek table created');

        await connection.query(`
            CREATE TABLE felhasznalo (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                jelszo VARCHAR(255) NOT NULL,
                vezeteknev VARCHAR(255),
                keresztnev VARCHAR(255),
                admin BOOLEAN DEFAULT false,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB;
        `);
        console.log('Felhasznalo table created');

        await connection.query(`
            CREATE TABLE rendeles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                felhasznalo_id INT NOT NULL,
                osszeg INT NOT NULL,
                statusz VARCHAR(50) DEFAULT 'feldolgozas_alatt',
                szallitasi_cim TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalo(id)
            ) ENGINE=InnoDB;
        `);
        console.log('Rendeles table created');

        await connection.query(`
            CREATE TABLE rendeles_tetel (
                id INT AUTO_INCREMENT PRIMARY KEY,
                rendeles_id INT NOT NULL,
                termek_id INT NOT NULL,
                mennyiseg INT NOT NULL,
                ar INT NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (rendeles_id) REFERENCES rendeles(id),
                FOREIGN KEY (termek_id) REFERENCES termek(id)
            ) ENGINE=InnoDB;
        `);
        console.log('Rendeles-tetel table created');

        await connection.query(`
            CREATE TABLE kosar (
                id INT AUTO_INCREMENT PRIMARY KEY,
                felhasznalo_id INT NOT NULL,
                termek_id INT NOT NULL,
                mennyiseg INT NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalo(id),
                FOREIGN KEY (termek_id) REFERENCES termek(id)
            ) ENGINE=InnoDB;
        `);
        console.log('Kosar table created');

        console.log('Database reset completed successfully!');
    } catch (error) {
        console.error('Error resetting database:', error);
    } finally {
        await connection.end();
    }
}

resetDatabase();

const mysql = require('mysql2');

// XAMPP default configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306
};

// Create MySQL connection
const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to XAMPP MySQL:', err);
        process.exit(1);
    }
    console.log('Successfully connected to XAMPP MySQL');
    
    // Try to create and use the database
    connection.query('CREATE DATABASE IF NOT EXISTS webshop_project', (err) => {
        if (err) {
            console.error('Error creating database:', err);
            process.exit(1);
        }
        console.log('Database created or already exists');
        
        connection.query('USE webshop_project', (err) => {
            if (err) {
                console.error('Error using database:', err);
                process.exit(1);
            }
            console.log('Using webshop_project database');
            process.exit(0);
        });
    });
});

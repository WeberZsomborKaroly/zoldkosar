const mysql = require('mysql2');
require('dotenv').config();


const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'webshop_project',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


const promisePool = pool.promise();

async function debugOrdersQuery() {
    try {
        console.log('Debugging orders query...');
        
        
        console.log('\nChecking rendelesek table structure:');
        const [rendelésekColumns] = await promisePool.query('DESCRIBE rendelesek');
        console.log(rendelésekColumns);
        
        
        console.log('\nChecking felhasznalok table structure:');
        const [felhasználókColumns] = await promisePool.query('DESCRIBE felhasznalok');
        console.log(felhasználókColumns);
        
        
        console.log('\nTrying a simple query on rendelesek:');
        const [simpleOrders] = await promisePool.query('SELECT id, felhasznalo_id, rendeles_szam, osszeg, statusz FROM rendelesek LIMIT 5');
        console.log('Simple orders query result:', simpleOrders);
        
        
        console.log('\nTrying the full query:');
        const query = `
            SELECT 
                r.id,
                r.felhasznalo_id,
                r.rendeles_szam,
                r.osszeg,
                r.statusz as allapot,
                r.szamlazasi_nev,
                r.szamlazasi_cim,
                r.szallitasi_nev,
                r.szallitasi_cim,
                r.adoszam,
                r.megjegyzes,
                r.letrehozva as datum,
                r.modositva,
                f.email,
                f.telefon,
                CONCAT(f.vezeteknev, ' ', f.keresztnev) as felhasznalo_nev
            FROM 
                rendelesek r
            LEFT JOIN 
                felhasznalok f ON r.felhasznalo_id = f.id
            ORDER BY 
                r.letrehozva DESC
            LIMIT 5
        `;
        
        try {
            const [orders] = await promisePool.query(query);
            console.log('Full query result:', orders);
            
            
            console.log('\nTrying to format the orders:');
            const formattedOrders = orders.map(order => {
                try {
                    return {
                        ...order,
                        vegosszeg: order.osszeg || 0,
                        fizetesi_mod: "Bankkártya",
                        datum: order.datum ? new Date(order.datum).toISOString() : null,
                        modositva: order.modositva ? new Date(order.modositva).toISOString() : null
                    };
                } catch (err) {
                    console.error('Error formatting order:', err, 'Order data:', order);
                    return null;
                }
            });
            
            console.log('Formatted orders:', formattedOrders);
        } catch (err) {
            console.error('Error executing full query:', err);
        }
    } catch (err) {
        console.error('Debug error:', err);
    } finally {
        await promisePool.end();
    }
}

debugOrdersQuery().then(() => {
    console.log('Debug complete');
}).catch(err => {
    console.error('Unhandled error:', err);
});

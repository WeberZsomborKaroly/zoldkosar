const db = require('./models');

async function checkProducts() {
  try {
    console.log('Checking all products in database...');
    const products = await db.Termek.findAll();
    
    console.log('\nAll products in database:');
    products.forEach(p => {
      console.log(`ID: ${p.id}, Type: ${typeof p.id}, Name: ${p.nev}, Price: ${p.ar}, Image: ${p.kep || 'No image'}`);
    });
    
    // Check products with IDs 6-9 specifically
    console.log('\nChecking products with IDs 6-9:');
    for (let i = 6; i <= 9; i++) {
      const product = await db.Termek.findByPk(i);
      if (product) {
        console.log(`Found product with ID ${i}:`);
        console.log(`  Name: ${product.nev}`);
        console.log(`  Price: ${product.ar}`);
        console.log(`  Image: ${product.kep || 'No image'}`);
      } else {
        console.log(`No product found with ID ${i}`);
      }
    }
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
}

checkProducts();

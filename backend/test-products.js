const db = require('./models');
const Termek = db.Termek;

async function testProducts() {
  try {
    console.log('Testing database products...');
    
    // Get all products
    const products = await Termek.findAll();
    console.log('All products in database:');
    products.forEach(p => {
      console.log(`ID: ${p.id}, Type: ${typeof p.id}, Name: ${p.nev}, Price: ${p.ar}`);
    });
    
    // Test finding a specific product
    const productId = 4; // Banán
    const product = await Termek.findByPk(productId);
    if (product) {
      console.log(`\nFound product with ID ${productId}:`);
      console.log(`  Name: ${product.nev}`);
      console.log(`  Price: ${product.ar}`);
      console.log(`  Stock: ${product.keszlet}`);
    } else {
      console.log(`\nProduct with ID ${productId} not found!`);
    }
    
    console.log('\nTest completed!');
  } catch (error) {
    console.error('Error testing products:', error);
  } finally {
    process.exit();
  }
}

// Run the test function
testProducts();

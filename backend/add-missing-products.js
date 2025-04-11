const db = require('./models');

async function addMissingProducts() {
  try {
    console.log('Adding missing products to the database...');
    
    
    const missingProducts = [
      {
        id: 6,
        nev: 'Alma',
        leiras: 'Friss piros alma',
        ar: 299,
        kep: 'uploads/alma.jpg',
        keszlet: 100,
        kategoria_id: 1,
        aktiv: true
      },
      {
        id: 7,
        nev: 'Félbarna kenyér',
        leiras: 'Friss félbarna kenyér',
        ar: 499,
        kep: 'uploads/felbarna_kenyer.jpg',
        keszlet: 50,
        kategoria_id: 1,
        aktiv: true
      },
      {
        id: 8,
        nev: 'Friss tej',
        leiras: '2.8%-os friss tej',
        ar: 399,
        kep: 'uploads/friss_tej.jpg',
        keszlet: 80,
        kategoria_id: 1,
        aktiv: true
      },
      {
        id: 9,
        nev: 'Paradicsom',
        leiras: 'Friss paradicsom',
        ar: 599,
        kep: 'uploads/paradicsom.jpg',
        keszlet: 70,
        kategoria_id: 1,
        aktiv: true
      }
    ];
    
    
    for (const product of missingProducts) {
     
      const existingProduct = await db.Termek.findByPk(product.id);
      
      if (existingProduct) {
        console.log(`Product with ID ${product.id} already exists, updating...`);
        await existingProduct.update(product);
        console.log(`Updated product: ${product.nev}`);
      } else {
        console.log(`Adding new product: ${product.nev}`);
        await db.Termek.create(product);
        console.log(`Added product: ${product.nev}`);
      }
    }
    
    console.log('All missing products have been added to the database!');
    
  } catch (err) {
    console.error('Error adding products:', err);
  } finally {
    process.exit();
  }
}

addMissingProducts();

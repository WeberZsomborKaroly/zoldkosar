const db = require('./models');
const Termek = db.Termek;
const Kategoria = db.Kategoria;

async function seedDatabase() {
  try {
    console.log('Seeding database with categories and products...');
    
    
    console.log('Adding categories...');
    
    
    await db.sequelize.query('DELETE FROM kategoria');
    await db.sequelize.query('ALTER TABLE kategoria AUTO_INCREMENT = 1');
    
    const categories = [
      { nev: 'Élelmiszer', szulo_kategoria: null, hivatkozas: 'elelmiszer', tizennyolc_plusz: false },
      { nev: 'Italok', szulo_kategoria: null, hivatkozas: 'italok', tizennyolc_plusz: false },
      { nev: 'Édességek', szulo_kategoria: null, hivatkozas: 'edessegek', tizennyolc_plusz: false },
      { nev: 'Gyümölcsök', szulo_kategoria: 1, hivatkozas: 'gyumolcsok', tizennyolc_plusz: false },
      { nev: 'Háztartási eszközök', szulo_kategoria: null, hivatkozas: 'haztartasi-eszkozok', tizennyolc_plusz: false }
    ];
    
    for (const category of categories) {
      await Kategoria.create(category);
    }
    
    const [categoryResult] = await db.sequelize.query('SELECT * FROM kategoria');
    console.log(`${categoryResult.length} categories created.`);
    
    
    console.log('Adding products...');
    
    
    await db.sequelize.query('DELETE FROM termek');
    await db.sequelize.query('ALTER TABLE termek AUTO_INCREMENT = 1');
    
    const products = [
      {
        nev: 'Csirkemell filé',
        leiras: 'Friss csirkemell filé, 1kg',
        ar: 2500,
        kep: 'uploads/csirkemell.jpg',
        keszlet: 50,
        kategoria_id: 1, // Élelmiszer
        aktiv: true
      },
      {
        nev: 'Chivas Regal 12 éves',
        leiras: 'Prémium skót whisky, 0.7l',
        ar: 9990,
        kep: 'uploads/chivas.jpg',
        keszlet: 20,
        kategoria_id: 2, // Italok
        aktiv: true
      },
      {
        nev: 'Milka csokoládé',
        leiras: 'Alpesi tejcsokoládé, 100g',
        ar: 599,
        kep: 'uploads/milka.jpg',
        keszlet: 100,
        kategoria_id: 3, // Édességek
        aktiv: true
      },
      {
        nev: 'Banán',
        leiras: 'Friss banán, 1kg',
        ar: 699,
        kep: 'uploads/banan.jpg',
        keszlet: 80,
        kategoria_id: 4, // Gyümölcsök
        aktiv: true
      },
      {
        nev: 'Serpenyő',
        leiras: 'Tapadásmentes serpenyő, 28cm',
        ar: 5990,
        kep: 'uploads/serpenyo.jpg',
        keszlet: 15,
        kategoria_id: 5, // Háztartási eszközök
        aktiv: true
      }
    ];
    
    
    for (const product of products) {
      await Termek.create({
        ...product,
        letrehozva: new Date(),
        modositva: new Date()
      });
    }
    
    const [productResult] = await db.sequelize.query('SELECT * FROM termek');
    console.log(`${productResult.length} products created.`);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}


seedDatabase();

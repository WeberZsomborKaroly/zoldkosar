const db = require('./models');
const Termek = db.Termek;


describe('Termék modell tesztek', () => {
  
  beforeAll(async () => {
    
    try {
      await db.sequelize.authenticate();
      console.log('Adatbázis kapcsolat sikeresen létrehozva.');
    } catch (error) {
      console.error('Nem sikerült kapcsolódni az adatbázishoz:', error);
    }
  });

  
  afterAll(async () => {
    
    await db.sequelize.close();
    console.log('Adatbázis kapcsolat lezárva.');
  });

 
  test('Az összes termék lekérdezése', async () => {
    const products = await Termek.findAll();
    
    
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    
    
    console.log('Összes termék az adatbázisban:');
    products.forEach(p => {
      console.log(`ID: ${p.id}, Név: ${p.nev}, Ár: ${p.ar}`);
    });
  });

  
  test('Termék keresése ID alapján', async () => {
    const productId = 4; // Banán
    const product = await Termek.findByPk(productId);
    
    
    expect(product).toBeDefined();
    expect(product).not.toBeNull();
    
    
    expect(product.id).toBe(productId);
    expect(product.nev).toBeDefined();
    expect(product.ar).toBeDefined();
    expect(typeof product.ar).toBe('number');
    
    
    console.log(`\nMegtalált termék ID ${productId}:`);
    console.log(`  Név: ${product.nev}`);
    console.log(`  Ár: ${product.ar}`);
    console.log(`  Készlet: ${product.keszlet}`);
  });

  
  test('Nem létező termék keresése', async () => {
    const nonExistentId = 9999;
    const product = await Termek.findByPk(nonExistentId);
    
    
    expect(product).toBeNull();
  });

  
  test('Termékek szűrése kategória alapján', async () => {
    const categoryId = 1; 
    const products = await Termek.findAll({
      where: {
        kategoria_id: categoryId
      }
    });
    
    
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    
    
    products.forEach(product => {
      expect(product.kategoria_id).toBe(categoryId);
    });
  });

 
  test('Termékek rendezése ár szerint', async () => {
    const products = await Termek.findAll({
      order: [['ar', 'ASC']]
    });
    
    
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    
    
    for (let i = 0; i < products.length - 1; i++) {
      expect(products[i].ar).toBeLessThanOrEqual(products[i + 1].ar);
    }
  });
});

const db = require('./models');
const Kategoria = db.Kategoria;
const Termek = db.Termek;


describe('Kategória modell tesztek', () => {
  
  let testCategoryId;
  const testCategoryName = 'Teszt Kategória ' + Date.now();

  
  beforeAll(async () => {
    
    try {
      await db.sequelize.authenticate();
      console.log('Adatbázis kapcsolat sikeresen létrehozva.');
    } catch (error) {
      console.error('Nem sikerült kapcsolódni az adatbázishoz:', error);
    }
  });

  
  afterAll(async () => {
    
    if (testCategoryId) {
      try {
        await Kategoria.destroy({
          where: { id: testCategoryId }
        });
        console.log(`Teszt kategória (ID: ${testCategoryId}) törölve.`);
      } catch (error) {
        console.error('Hiba a teszt kategória törlésekor:', error);
      }
    }

    
    await db.sequelize.close();
    console.log('Adatbázis kapcsolat lezárva.');
  });

  
  test('Kategória létrehozása', async () => {
    
    const categoryData = {
      nev: testCategoryName,
      leiras: 'Ez egy teszt kategória leírás',
      aktiv: true,
      sorrend: 999
    };
    
    
    const category = await Kategoria.create(categoryData);
    testCategoryId = category.id;
    
    
    expect(category).toBeDefined();
    expect(category.id).toBeDefined();
    expect(category.nev).toBe(categoryData.nev);
    expect(category.leiras).toBe(categoryData.leiras);
    expect(category.aktiv).toBe(categoryData.aktiv);
    
    console.log(`Teszt kategória létrehozva, ID: ${category.id}`);
  });

  
  test('Kategória keresése ID alapján', async () => {
    const category = await Kategoria.findByPk(testCategoryId);
    
    
    expect(category).toBeDefined();
    expect(category).not.toBeNull();
    expect(category.id).toBe(testCategoryId);
    expect(category.nev).toBe(testCategoryName);
  });

  
  test('Kategória adatainak frissítése', async () => {
    
    const newDescription = 'Frissített teszt kategória leírás';
    
   
    const [updatedRows] = await Kategoria.update(
      { leiras: newDescription },
      { where: { id: testCategoryId } }
    );
    
    
    expect(updatedRows).toBe(1);
    
    
    const updatedCategory = await Kategoria.findByPk(testCategoryId);
    expect(updatedCategory.leiras).toBe(newDescription);
  });

  
  test('Összes aktív kategória lekérdezése', async () => {
    const categories = await Kategoria.findAll({
      where: { aktiv: true },
      order: [['sorrend', 'ASC']]
    });
    
    
    expect(categories).toBeDefined();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    
   
    categories.forEach(category => {
      expect(category.aktiv).toBe(true);
    });
    
    console.log(`Aktív kategóriák száma: ${categories.length}`);
  });

  
  test('Kategória tábla szerkezetének ellenőrzése', async () => {
    
    const category = await Kategoria.findByPk(testCategoryId);
    
    
    expect(category).toHaveProperty('id');
    expect(category).toHaveProperty('nev');
    expect(category).toHaveProperty('leiras');
    expect(category).toHaveProperty('aktiv');
    expect(category).toHaveProperty('sorrend');
    expect(category).toHaveProperty('createdAt');
    expect(category).toHaveProperty('updatedAt');
  });

  
  test('Kategória termékek lekérdezése', async () => {
    
    const productsInCategory = await Termek.findAll({
      where: { kategoria_id: testCategoryId }
    });
    
    
    if (productsInCategory.length === 0) {
      console.log('Nincs termék a teszt kategóriában, ezt csak naplózzuk.');
    }
    
    
    const categoryWithProducts = await Kategoria.findByPk(testCategoryId, {
      include: [Termek]
    });
    
   
    expect(categoryWithProducts).toBeDefined();
    expect(categoryWithProducts).not.toBeNull();
    
    
    expect(categoryWithProducts.termekek).toBeDefined();
    expect(Array.isArray(categoryWithProducts.termekek)).toBe(true);
  });
});

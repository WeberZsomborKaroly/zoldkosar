const db = require('./models');
const Felhasznalo = db.Felhasznalo;
const bcrypt = require('bcryptjs');


describe('Felhasználó modell tesztek', () => {
  
  const testUser = {
    email: 'teszt@example.com',
    jelszo: 'Jelszo123!',
    vezeteknev: 'Teszt',
    keresztnev: 'Felhasználó',
    admin: false,
    szerepkor: 'user',
    telefon: '+36301234567',
    iranyitoszam: 1234,
    telepules: 'Tesztváros',
    kozterulet: 'Teszt utca 10.',
    hirlevel: true,
    email_megerositva: true,
    aktiv: true
  };

  let createdUserId;

  
  beforeAll(async () => {
    
    try {
      await db.sequelize.authenticate();
      console.log('Adatbázis kapcsolat sikeresen létrehozva.');
    } catch (error) {
      console.error('Nem sikerült kapcsolódni az adatbázishoz:', error);
    }
  });

  
  afterAll(async () => {
    
    if (createdUserId) {
      try {
        await Felhasznalo.destroy({
          where: { id: createdUserId }
        });
        console.log(`Teszt felhasználó (ID: ${createdUserId}) törölve.`);
      } catch (error) {
        console.error('Hiba a teszt felhasználó törlésekor:', error);
      }
    }

    
    await db.sequelize.close();
    console.log('Adatbázis kapcsolat lezárva.');
  });

  
  test('Felhasználó létrehozása', async () => {

    const hashedPassword = await bcrypt.hash(testUser.jelszo, 10);
    

    const user = await Felhasznalo.create({
      ...testUser,
      jelszo: hashedPassword
    });
    
    
    createdUserId = user.id;
    
 
    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.email).toBe(testUser.email);
    expect(user.vezeteknev).toBe(testUser.vezeteknev);
    expect(user.keresztnev).toBe(testUser.keresztnev);
    
    console.log(`Teszt felhasználó létrehozva, ID: ${user.id}`);
  });

 
  test('Felhasználó keresése email alapján', async () => {
    const user = await Felhasznalo.findOne({
      where: { email: testUser.email }
    });
    

    expect(user).toBeDefined();
    expect(user).not.toBeNull();
    expect(user.email).toBe(testUser.email);
    
  
    const validPassword = await bcrypt.compare(testUser.jelszo, user.jelszo);
    expect(validPassword).toBe(true);
  });

 
  test('Felhasználó adatainak frissítése', async () => {

    const newPhone = '+36309876543';
    

    const [updatedRows] = await Felhasznalo.update(
      { telefon: newPhone },
      { where: { id: createdUserId } }
    );
    

    expect(updatedRows).toBe(1);
    
  
    const updatedUser = await Felhasznalo.findByPk(createdUserId);
    expect(updatedUser.telefon).toBe(newPhone);
  });


  test('Admin felhasználók keresése', async () => {
    const adminUsers = await Felhasznalo.findAll({
      where: { szerepkor: 'admin' }
    });
    
    
    expect(adminUsers).toBeDefined();
    expect(Array.isArray(adminUsers)).toBe(true);
    

    adminUsers.forEach(user => {
      expect(user.szerepkor).toBe('admin');
    });
    
    console.log(`Talált admin felhasználók száma: ${adminUsers.length}`);
  });


  test('Felhasználók szűrése hírlevél feliratkozás alapján', async () => {
    const newsletterUsers = await Felhasznalo.findAll({
      where: { hirlevel: true }
    });
    

    expect(newsletterUsers).toBeDefined();
    expect(Array.isArray(newsletterUsers)).toBe(true);
    
    
    newsletterUsers.forEach(user => {
      expect(user.hirlevel).toBe(true);
    });
    
    console.log(`Hírlevélre feliratkozott felhasználók száma: ${newsletterUsers.length}`);
  });
});

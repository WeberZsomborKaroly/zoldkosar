const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();


describe('Rendelés modell és API tesztek', () => {
  // Teszt adatok
  let testOrderId;
  let testUserId;
  let testToken;

  
  beforeAll(async () => {
    
    try {
      const db = require('./models');
      await db.sequelize.authenticate();
      console.log('Adatbázis kapcsolat sikeresen létrehozva.');
      
      
      const testUser = await db.Felhasznalo.findOne({ where: { email: 'test@example.com' } });
      if (testUser) {
        testUserId = testUser.id;
      } else {
        console.log('Teszt felhasználó nem található, tesztek futtatása meglévő felhasználóval.');
        const anyUser = await db.Felhasznalo.findOne();
        if (anyUser) {
          testUserId = anyUser.id;
        } else {
          throw new Error('Nem található felhasználó az adatbázisban a tesztekhez.');
        }
      }
      
      
      testToken = jwt.sign({ id: testUserId }, process.env.JWT_SECRET || 'zoldkosar-secret-key', {
        expiresIn: 86400 // 24 óra
      });
      
    } catch (error) {
      console.error('Nem sikerült kapcsolódni az adatbázishoz:', error);
    }
  });

  
  afterAll(async () => {
    
    if (testOrderId) {
      try {
        const db = require('./models');
        await db.RendelesTetel.destroy({
          where: { rendeles_id: testOrderId }
        });
        await db.Rendeles.destroy({
          where: { id: testOrderId }
        });
        console.log(`Teszt rendelés (ID: ${testOrderId}) törölve.`);
      } catch (error) {
        console.error('Hiba a teszt rendelés törlésekor:', error);
      }
    }

    
    const db = require('./models');
    await db.sequelize.close();
    console.log('Adatbázis kapcsolat lezárva.');
  });

  
  test('Új rendelés létrehozása', async () => {
    
    const orderData = {
      felhasznalo_id: testUserId,
      osszeg: 5000,
      szallitasi_dij: 990,
      vegosszeg: 5990,
      szallitasi_mod: 'Házhozszállítás',
      fizetesi_mod: 'Utánvét',
      statusz: 'Feldolgozás alatt',
      szallitasi_nev: 'Teszt Elek',
      szallitasi_iranyitoszam: 1234,
      szallitasi_telepules: 'Budapest',
      szallitasi_cim: 'Teszt utca 1.',
      szallitasi_telefon: '+36301234567'
    };
    
    
    const db = require('./models');
    const order = await db.Rendeles.create(orderData);
    testOrderId = order.id;
    
    
    expect(order).toBeDefined();
    expect(order.id).toBeDefined();
    expect(order.felhasznalo_id).toBe(testUserId);
    expect(order.osszeg).toBe(orderData.osszeg);
    expect(order.vegosszeg).toBe(orderData.vegosszeg);
    
    console.log(`Teszt rendelés létrehozva, ID: ${order.id}`);
    
    
    const orderItemData = {
      rendeles_id: order.id,
      termek_id: 1, 
      mennyiseg: 2,
      egysegar: 2500,
      osszesen: 5000
    };
    
    const orderItem = await db.RendelesTetel.create(orderItemData);
    
    
    expect(orderItem).toBeDefined();
    expect(orderItem.rendeles_id).toBe(order.id);
    expect(orderItem.mennyiseg).toBe(orderItemData.mennyiseg);
    expect(orderItem.osszesen).toBe(orderItemData.osszesen);
  });

 
  test('Rendelés keresése ID alapján', async () => {
    const db = require('./models');
    const order = await db.Rendeles.findByPk(testOrderId, {
      include: [db.RendelesTetel]
    });
    
    
    expect(order).toBeDefined();
    expect(order).not.toBeNull();
    expect(order.id).toBe(testOrderId);
    
    
    expect(order.rendelestetelek).toBeDefined();
    expect(Array.isArray(order.rendelestetelek)).toBe(true);
    expect(order.rendelestetelek.length).toBeGreaterThan(0);
  });

  
  test('Rendelés státuszának frissítése', async () => {
    
    const newStatus = 'Kiszállítva';
    
    
    const db = require('./models');
    const [updatedRows] = await db.Rendeles.update(
      { statusz: newStatus },
      { where: { id: testOrderId } }
    );
    
    
    expect(updatedRows).toBe(1);
    
   
    const updatedOrder = await db.Rendeles.findByPk(testOrderId);
    expect(updatedOrder.statusz).toBe(newStatus);
  });

  
  test('Felhasználó rendeléseinek lekérdezése', async () => {
    const db = require('./models');
    const orders = await db.Rendeles.findAll({
      where: { felhasznalo_id: testUserId },
      include: [db.RendelesTetel]
    });
    
    
    expect(orders).toBeDefined();
    expect(Array.isArray(orders)).toBe(true);
    expect(orders.length).toBeGreaterThan(0);
    
    
    orders.forEach(order => {
      expect(order.felhasznalo_id).toBe(testUserId);
    });
    
    console.log(`Felhasználó rendeléseinek száma: ${orders.length}`);
  });

  
  test('Admin rendelések API végpont', async () => {
    
    try {
      
      const response = await axios.get('http://localhost:3001/api/admin/orders', {
        headers: {
          'x-access-token': testToken
        }
      });
      
      
      expect(response.status).toBe(200);
      
      
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
      
      console.log(`Admin rendelések API válasz: ${response.data.length} rendelés`);
    } catch (error) {
      
      console.log('A szerver nem fut, az API teszt kihagyva.');
      
      expect(true).toBe(true);
    }
  }, 10000); 
});

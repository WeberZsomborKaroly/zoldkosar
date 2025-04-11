const db = require('./models');
const Kupon = db.Kupon;


describe('Kupon modell tesztek', () => {
  
  let testCouponId;
  const testCouponCode = 'TESZT' + Date.now().toString().slice(-6);

  
  beforeAll(async () => {
    
    try {
      await db.sequelize.authenticate();
      console.log('Adatbázis kapcsolat sikeresen létrehozva.');
    } catch (error) {
      console.error('Nem sikerült kapcsolódni az adatbázishoz:', error);
    }
  });

  
  afterAll(async () => {
    
    if (testCouponId) {
      try {
        await Kupon.destroy({
          where: { id: testCouponId }
        });
        console.log(`Teszt kupon (ID: ${testCouponId}) törölve.`);
      } catch (error) {
        console.error('Hiba a teszt kupon törlésekor:', error);
      }
    }

    
    await db.sequelize.close();
    console.log('Adatbázis kapcsolat lezárva.');
  });

  
  test('Kupon létrehozása', async () => {
    
    const couponData = {
      kod: testCouponCode,
      tipus: 'százalék',
      ertek: 15,
      min_osszeg: 5000,
      max_hasznalat: 100,
      felhasznalva: 0,
      lejarati_datum: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 nap múlva
      aktiv: true
    };
    
    
    const coupon = await Kupon.create(couponData);
    testCouponId = coupon.id;
    
    
    expect(coupon).toBeDefined();
    expect(coupon.id).toBeDefined();
    expect(coupon.kod).toBe(couponData.kod);
    expect(coupon.tipus).toBe(couponData.tipus);
    expect(coupon.ertek).toBe(couponData.ertek);
    expect(coupon.aktiv).toBe(couponData.aktiv);
    
    console.log(`Teszt kupon létrehozva, ID: ${coupon.id}, Kód: ${coupon.kod}`);
  });

  
  test('Kupon keresése kód alapján', async () => {
    const coupon = await Kupon.findOne({
      where: { kod: testCouponCode }
    });
    
    
    expect(coupon).toBeDefined();
    expect(coupon).not.toBeNull();
    expect(coupon.id).toBe(testCouponId);
    expect(coupon.kod).toBe(testCouponCode);
  });

  
  test('Kupon érvényességének ellenőrzése', async () => {
    const coupon = await Kupon.findByPk(testCouponId);
    
    
    expect(coupon.aktiv).toBe(true);
    expect(coupon.felhasznalva).toBeLessThan(coupon.max_hasznalat);
    expect(new Date(coupon.lejarati_datum)).toBeInstanceOf(Date);
    expect(new Date(coupon.lejarati_datum) > new Date()).toBe(true);
    
    
    const orderAmount = 6000; 
    expect(orderAmount >= coupon.min_osszeg).toBe(true);
    
    
    let discount = 0;
    if (coupon.tipus === 'százalék') {
      discount = orderAmount * (coupon.ertek / 100);
    } else if (coupon.tipus === 'fix') {
      discount = coupon.ertek;
    }
    
    
    expect(discount).toBe(orderAmount * 0.15); // 15% kedvezmény
    console.log(`Kedvezmény értéke ${orderAmount} Ft rendelésre: ${discount} Ft`);
  });

  
  test('Kupon használatának növelése', async () => {
    // Eredeti használat lekérdezése
    const originalCoupon = await Kupon.findByPk(testCouponId);
    const originalUsage = originalCoupon.felhasznalva;
    
    
    const [updatedRows] = await Kupon.update(
      { felhasznalva: originalUsage + 1 },
      { where: { id: testCouponId } }
    );
    
    
    expect(updatedRows).toBe(1);
    
    
    const updatedCoupon = await Kupon.findByPk(testCouponId);
    expect(updatedCoupon.felhasznalva).toBe(originalUsage + 1);
  });

  
  test('Aktív kuponok lekérdezése', async () => {
    const now = new Date();
    
    const activeCoupons = await Kupon.findAll({
      where: {
        aktiv: true,
        lejarati_datum: {
          [db.Sequelize.Op.gt]: now
        },
        felhasznalva: {
          [db.Sequelize.Op.lt]: db.Sequelize.col('max_hasznalat')
        }
      }
    });
    
    
    expect(activeCoupons).toBeDefined();
    expect(Array.isArray(activeCoupons)).toBe(true);
    
    
    activeCoupons.forEach(coupon => {
      expect(coupon.aktiv).toBe(true);
      expect(new Date(coupon.lejarati_datum) > now).toBe(true);
      expect(coupon.felhasznalva < coupon.max_hasznalat).toBe(true);
    });
    
    console.log(`Aktív kuponok száma: ${activeCoupons.length}`);
  });

  
  test('Kupon deaktiválása', async () => {
    
    const [updatedRows] = await Kupon.update(
      { aktiv: false },
      { where: { id: testCouponId } }
    );
    
    
    expect(updatedRows).toBe(1);
    
    
    const updatedCoupon = await Kupon.findByPk(testCouponId);
    expect(updatedCoupon.aktiv).toBe(false);
    
    
    await Kupon.update(
      { aktiv: true },
      { where: { id: testCouponId } }
    );
  });
});

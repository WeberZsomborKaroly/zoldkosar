const db = require('./models');
const Kosar = db.Kosar;
const KosarTetel = db.KosarTetel;
const Termek = db.Termek;


describe('Kosár modell tesztek', () => {
 
  let testCartId;
  let testUserId = 1; 
  let testProductId = 1; 

 
  beforeAll(async () => {
   
    try {
      await db.sequelize.authenticate();
      console.log('Adatbázis kapcsolat sikeresen létrehozva.');
      
      
      const product = await Termek.findOne();
      if (product) {
        testProductId = product.id;
      } else {
        console.warn('Figyelmeztetés: Nincs termék az adatbázisban, a tesztek hibásak lehetnek.');
      }
      
    } catch (error) {
      console.error('Nem sikerült kapcsolódni az adatbázishoz:', error);
    }
  });

 
  afterAll(async () => {
   
    if (testCartId) {
      try {
        await KosarTetel.destroy({
          where: { kosar_id: testCartId }
        });
        await Kosar.destroy({
          where: { id: testCartId }
        });
        console.log(`Teszt kosár (ID: ${testCartId}) törölve.`);
      } catch (error) {
        console.error('Hiba a teszt kosár törlésekor:', error);
      }
    }

    
    await db.sequelize.close();
    console.log('Adatbázis kapcsolat lezárva.');
  });

  
  test('Kosár létrehozása', async () => {
    // Kosár adatok
    const cartData = {
      felhasznalo_id: testUserId,
      session_id: 'test-session-' + Date.now(),
      osszesen: 0
    };
    
    
    const cart = await Kosar.create(cartData);
    testCartId = cart.id;
    
    
    expect(cart).toBeDefined();
    expect(cart.id).toBeDefined();
    expect(cart.felhasznalo_id).toBe(testUserId);
    expect(cart.session_id).toBe(cartData.session_id);
    expect(cart.osszesen).toBe(0);
    
    console.log(`Teszt kosár létrehozva, ID: ${cart.id}`);
  });

  
  test('Termék hozzáadása a kosárhoz', async () => {
    
    const product = await Termek.findByPk(testProductId);
    expect(product).toBeDefined();
    expect(product).not.toBeNull();
    
    
    const cartItemData = {
      kosar_id: testCartId,
      termek_id: testProductId,
      mennyiseg: 2,
      egysegar: product.ar,
      osszesen: product.ar * 2
    };
    
   
    const cartItem = await KosarTetel.create(cartItemData);
    
    
    expect(cartItem).toBeDefined();
    expect(cartItem.kosar_id).toBe(testCartId);
    expect(cartItem.termek_id).toBe(testProductId);
    expect(cartItem.mennyiseg).toBe(cartItemData.mennyiseg);
    expect(cartItem.egysegar).toBe(cartItemData.egysegar);
    expect(cartItem.osszesen).toBe(cartItemData.osszesen);
    
    
    await Kosar.update(
      { osszesen: cartItemData.osszesen },
      { where: { id: testCartId } }
    );
    
    
    const updatedCart = await Kosar.findByPk(testCartId);
    expect(updatedCart.osszesen).toBe(cartItemData.osszesen);
  });

  
  test('Kosár lekérdezése tételekkel együtt', async () => {
    const cart = await Kosar.findByPk(testCartId, {
      include: [{
        model: KosarTetel,
        include: [Termek]
      }]
    });
    
    
    expect(cart).toBeDefined();
    expect(cart).not.toBeNull();
    expect(cart.id).toBe(testCartId);
    
    
    expect(cart.kosartetelek).toBeDefined();
    expect(Array.isArray(cart.kosartetelek)).toBe(true);
    expect(cart.kosartetelek.length).toBeGreaterThan(0);
    
    
    expect(cart.kosartetelek[0].termek).toBeDefined();
    expect(cart.kosartetelek[0].termek.id).toBe(testProductId);
  });

  
  test('Kosártétel mennyiségének módosítása', async () => {
    
    const newQuantity = 3;
    
    
    const product = await Termek.findByPk(testProductId);
    const newTotal = product.ar * newQuantity;
    
    
    const [updatedRows] = await KosarTetel.update(
      { 
        mennyiseg: newQuantity,
        osszesen: newTotal
      },
      { 
        where: { 
          kosar_id: testCartId,
          termek_id: testProductId
        } 
      }
    );
    
    
    expect(updatedRows).toBe(1);
    
    
    const updatedCartItem = await KosarTetel.findOne({
      where: { 
        kosar_id: testCartId,
        termek_id: testProductId
      }
    });
    expect(updatedCartItem.mennyiseg).toBe(newQuantity);
    expect(updatedCartItem.osszesen).toBe(newTotal);
    
    
    await Kosar.update(
      { osszesen: newTotal },
      { where: { id: testCartId } }
    );
    
    
    const updatedCart = await Kosar.findByPk(testCartId);
    expect(updatedCart.osszesen).toBe(newTotal);
  });

  
  test('Termék törlése a kosárból', async () => {
    
    const deletedRows = await KosarTetel.destroy({
      where: { 
        kosar_id: testCartId,
        termek_id: testProductId
      }
    });
    
    
    expect(deletedRows).toBe(1);
    
    
    const deletedCartItem = await KosarTetel.findOne({
      where: { 
        kosar_id: testCartId,
        termek_id: testProductId
      }
    });
    expect(deletedCartItem).toBeNull();
    
    
    await Kosar.update(
      { osszesen: 0 },
      { where: { id: testCartId } }
    );
    
    
    const updatedCart = await Kosar.findByPk(testCartId);
    expect(updatedCart.osszesen).toBe(0);
  });
});

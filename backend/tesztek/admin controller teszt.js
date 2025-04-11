const adminController = require('../controllers/admin.controller');
const mysql = require('mysql2');

jest.mock('mysql2');

describe('Admin Controller', () => {
  let mockPool;
  let mockPromisePool;
  let mockQuery;
  let mockExecute;
  let req;
  let res;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockQuery = jest.fn();
    mockExecute = jest.fn();
    
    mockPromisePool = {
      query: mockQuery,
      execute: mockExecute
    };
    
    mockPool = {
      promise: jest.fn().mockReturnValue(mockPromisePool)
    };
    
    mysql.createPool.mockReturnValue(mockPool);
    
    req = {
      params: {},
      query: {},
      body: {}
    };
    
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    
    process.env.DB_HOST = 'localhost';
    process.env.DB_USER = 'root';
    process.env.DB_PASSWORD = '';
    process.env.DB_NAME = 'webshop_project';
  });
  
  test('getStats should return dashboard statistics', async () => {
    mockQuery.mockImplementation((query) => {
      if (query.includes('termekek')) {
        return [[{ count: 100 }]];
      } else if (query.includes('rendelesek') && !query.includes('JOIN')) {
        return [[{ count: 50 }]];
      } else if (query.includes('felhasznalok')) {
        return [[{ count: 25 }]];
      } else if (query.includes('JOIN')) {
        return [
          { id: 1, mennyiseg: 2, ar: 1000 },
          { id: 2, mennyiseg: 1, ar: 2000 }
        ];
      }
    });
    
    await adminController.getStats(req, res);
    
    expect(mockQuery).toHaveBeenCalledTimes(4);
    expect(res.json).toHaveBeenCalledWith({
      productCount: 100,
      orderCount: 50,
      userCount: 25,
      totalRevenue: 4000
    });
  });
  
  test('getProducts should return all active products', async () => {
    const mockProducts = [
      { id: 1, nev: 'Test Product 1', ar: 1000 },
      { id: 2, nev: 'Test Product 2', ar: 2000 }
    ];
    
    mockQuery.mockResolvedValue([mockProducts]);
    
    await adminController.getProducts(req, res);
    
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('FROM termekek'));
    expect(res.json).toHaveBeenCalledWith(mockProducts);
  });
  
  test('updateProduct should update product details', async () => {
    req.params.id = '1';
    req.body = {
      nev: 'Updated Product',
      leiras: 'Updated description',
      ar: 1500,
      akcios_ar: 1200,
      keszlet: 50,
      kategoria_id: 2,
      kep: 'updated.jpg',
      kiszereles: '1kg',
      akcios: 1,
      akcio_kezdete: '2025-01-01',
      akcio_vege: '2025-12-31',
      hivatkozas: 'updated-product',
      tizennyolc_plusz: 0
    };
    
    mockQuery.mockImplementation((query, params) => {
      if (query.includes('SELECT * FROM termekek WHERE id = ?')) {
        if (params[0] === '1') {
          return [[{ id: 1, nev: 'Original Product' }]];
        }
      } else if (query.includes('UPDATE termekek')) {
        return [{ affectedRows: 1 }];
      } else if (query.includes('SELECT * FROM termekek WHERE id = ?') && !query.includes('AND aktiv = 1')) {
        return [[{ id: 1, nev: 'Updated Product' }]];
      }
    });
    
    await adminController.updateProduct(req, res);
    
    expect(mockQuery).toHaveBeenCalledTimes(3);
    expect(res.json).toHaveBeenCalledWith({
      message: 'A termék sikeresen frissítve.',
      product: { id: 1, nev: 'Updated Product' }
    });
  });
  
  test('deleteProduct should mark product as inactive', async () => {
    req.params.id = '1';
    
    mockQuery.mockImplementation((query, params) => {
      if (query.includes('SELECT * FROM termekek WHERE id = ?')) {
        return [[{ id: 1, nev: 'Product to delete' }]];
      } else if (query.includes('UPDATE termekek SET aktiv = 0')) {
        return [{ affectedRows: 1 }];
      }
    });
    
    await adminController.deleteProduct(req, res);
    
    expect(mockQuery).toHaveBeenCalledWith('UPDATE termekek SET aktiv = 0 WHERE id = ?', ['1']);
    expect(res.json).toHaveBeenCalledWith({
      message: 'A termék sikeresen törölve.'
    });
  });
  
  test('createProduct should add new product', async () => {
    req.body = {
      nev: 'New Product',
      leiras: 'New description',
      ar: 2000,
      akcios_ar: null,
      keszlet: 100,
      kategoria_id: 1,
      kep: 'new.jpg',
      kiszereles: '500g',
      akcios: 0,
      akcio_kezdete: null,
      akcio_vege: null,
      hivatkozas: 'new-product',
      tizennyolc_plusz: 0
    };
    
    mockQuery.mockImplementation((query) => {
      if (query.includes('INSERT INTO termekek')) {
        return [{ insertId: 10 }];
      } else if (query.includes('SELECT * FROM termekek WHERE id = ?')) {
        return [[{ id: 10, nev: 'New Product' }]];
      }
    });
    
    await adminController.createProduct(req, res);
    
    expect(mockQuery).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'A termék sikeresen létrehozva.',
      product: { id: 10, nev: 'New Product' }
    });
  });
  
  test('getOrders should return formatted orders', async () => {
    const mockOrders = [
      {
        id: 1,
        felhasznalo_id: 2,
        rendeles_szam: 'ORD-001',
        osszeg: 5000,
        allapot: 'új',
        szallitasi_cim: JSON.stringify({
          nev: 'Test User',
          email: 'test@example.com',
          telefon: '123456789',
          szallitasiCim: {
            iranyitoszam: '1234',
            varos: 'Test City',
            utca: 'Test Street',
            hazszam: '42',
            megye: 'Test County'
          }
        }),
        datum: '2025-04-01 10:00:00',
        email: 'user@example.com',
        telefon: '987654321',
        vezeteknev: 'Test',
        keresztnev: 'User',
        felhasznalo_nev: 'Test User'
      }
    ];
    
    mockExecute.mockResolvedValue([mockOrders]);
    
    await adminController.getOrders(req, res);
    
    expect(mockExecute).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    const formattedOrders = res.json.mock.calls[0][0];
    expect(formattedOrders.length).toBe(1);
    expect(formattedOrders[0].vegosszeg).toBe(5000);
    expect(formattedOrders[0].szallitasi_cim).toContain('Test City');
  });
  
  test('getOrderItems should return items for specific order', async () => {
    req.params.id = '1';
    
    const mockItems = [
      { id: 1, termek_id: 10, mennyiseg: 2, egysegar: 1000, termek_nev: 'Test Product 1' },
      { id: 2, termek_id: 20, mennyiseg: 1, egysegar: 2000, termek_nev: 'Test Product 2' }
    ];
    
    mockExecute.mockResolvedValue([mockItems]);
    
    await adminController.getOrderItems(req, res);
    
    expect(mockExecute).toHaveBeenCalledWith(
      expect.stringContaining('FROM rendeles_tetelek rt'),
      ['1']
    );
    expect(res.json).toHaveBeenCalledWith(mockItems);
  });
  
  test('updateOrderStatus should update order status', async () => {
    req.params.id = '1';
    req.body = { allapot: 'teljesitve' };
    
    mockQuery.mockResolvedValue([{ affectedRows: 1 }]);
    
    await adminController.updateOrderStatus(req, res);
    
    expect(mockQuery).toHaveBeenCalledWith(
      'UPDATE rendelesek SET statusz = ? WHERE id = ?',
      ['teljesítve', '1']
    );
    expect(res.json).toHaveBeenCalledWith({
      message: 'Rendelés státusza sikeresen frissítve'
    });
  });
  
  test('getCategories should return all active categories', async () => {
    const mockCategories = [
      { id: 1, nev: 'Category 1' },
      { id: 2, nev: 'Category 2' }
    ];
    
    mockQuery.mockResolvedValue([mockCategories]);
    
    await adminController.getCategories(req, res);
    
    expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM kategoriak WHERE aktiv = 1 ORDER BY nev');
    expect(res.json).toHaveBeenCalledWith(mockCategories);
  });
  
  test('getUsers should return all active users', async () => {
    const mockUsers = [
      { id: 1, email: 'user1@example.com', vezeteknev: 'User', keresztnev: 'One' },
      { id: 2, email: 'user2@example.com', vezeteknev: 'User', keresztnev: 'Two' }
    ];
    
    mockQuery.mockResolvedValue([mockUsers]);
    
    await adminController.getUsers(req, res);
    
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('FROM felhasznalok'));
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });
  
  test('updateUser should update user details', async () => {
    req.params.id = '1';
    req.body = {
      vezeteknev: 'Updated',
      keresztnev: 'User',
      email: 'updated@example.com',
      telefon: '123456789',
      szerepkor: 'user'
    };
    
    mockQuery.mockImplementation((query, params) => {
      if (query.includes('SELECT * FROM felhasznalok WHERE id = ?')) {
        return [[{ id: 1, email: 'original@example.com' }]];
      } else if (query.includes('SELECT * FROM felhasznalok WHERE email = ?')) {
        return [[]];
      } else if (query.includes('UPDATE felhasznalok')) {
        return [{ affectedRows: 1 }];
      } else if (query.includes('SELECT id, email')) {
        return [[{ id: 1, email: 'updated@example.com' }]];
      }
    });
    
    await adminController.updateUser(req, res);
    
    expect(mockQuery).toHaveBeenCalledTimes(4);
    expect(res.json).toHaveBeenCalledWith({
      message: 'A felhasználó sikeresen frissítve',
      user: { id: 1, email: 'updated@example.com' }
    });
  });
  
  test('deleteUser should mark user as inactive', async () => {
    req.params.id = '1';
    
    mockQuery.mockImplementation((query, params) => {
      if (query.includes('SELECT * FROM felhasznalok WHERE id = ?')) {
        return [[{ id: 1, email: 'user@example.com' }]];
      } else if (query.includes('UPDATE felhasznalok SET aktiv = 0')) {
        return [{ affectedRows: 1 }];
      }
    });
    
    await adminController.deleteUser(req, res);
    
    expect(mockQuery).toHaveBeenCalledWith(
      'UPDATE felhasznalok SET aktiv = 0 WHERE id = ?',
      ['1']
    );
    expect(res.json).toHaveBeenCalledWith({
      message: 'A felhasználó sikeresen törölve',
      id: '1'
    });
  });
  
  test('getTopProducts should return top 5 selling products', async () => {
    const mockTopProducts = [
      { id: 1, nev: 'Top Product 1', ar: 1000, keszlet: 50, eladasok: 100 },
      { id: 2, nev: 'Top Product 2', ar: 2000, keszlet: 30, eladasok: 80 }
    ];
    
    mockQuery.mockResolvedValue([mockTopProducts]);
    
    await adminController.getTopProducts(req, res);
    
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('ORDER BY eladasok DESC'));
    expect(res.json).toHaveBeenCalledWith(mockTopProducts);
  });
});

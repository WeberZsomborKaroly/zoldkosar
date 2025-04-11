const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');


jest.mock('mysql2/promise');


jest.mock('bcryptjs');


const createAdminScript = require('../scripts/create-admin');

describe('Create Admin Script', () => {
  let mockConnection;
  let mockExecute;
  let mockEnd;
  
  beforeEach(() => {
  
    jest.clearAllMocks();
    

    mockExecute = jest.fn();
    mockEnd = jest.fn().mockResolvedValue();
    mockConnection = {
      execute: mockExecute,
      end: mockEnd
    };
    

    mysql.createConnection.mockResolvedValue(mockConnection);
    

    bcrypt.hash.mockResolvedValue('hashed_password_123');
    
   
    console.log = jest.fn();
    console.error = jest.fn();
  });
  
  test('should create admin user when it does not exist', async () => {
    
    mockExecute.mockResolvedValueOnce([[]]);
    mockExecute.mockResolvedValueOnce({ insertId: 1 });
    
  
    await createAdminScript.createAdmin();
    
   
    expect(mockExecute).toHaveBeenCalledWith(
      'SELECT * FROM felhasznalok WHERE email = ?',
      ['admin@webshop.com']
    );
    
    
    expect(bcrypt.hash).toHaveBeenCalledWith('admin123', 10);
    

    expect(mockExecute).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO felhasznalok'),
      [
        'admin@webshop.com',
        'hashed_password_123',
        'Admin',
        'User',
        '123456789',
        'admin',
        1,
        1
      ]
    );
    
   
    expect(mockEnd).toHaveBeenCalled();
    
    
    expect(console.log).toHaveBeenCalledWith('Admin user created successfully');
  });
  
  test('should not create admin user when it already exists', async () => {
    
    mockExecute.mockResolvedValueOnce([[{ id: 1, email: 'admin@webshop.com' }]]);
    
    
    await createAdminScript.createAdmin();
    
   
    expect(mockExecute).toHaveBeenCalledWith(
      'SELECT * FROM felhasznalok WHERE email = ?',
      ['admin@webshop.com']
    );
    
    // Verify insert was not called
    expect(mockExecute).toHaveBeenCalledTimes(1);
    
    // Verify connection was closed
    expect(mockEnd).toHaveBeenCalled();
    
    
    expect(console.log).toHaveBeenCalledWith('Admin user already exists');
  });
  
  test('should handle database errors', async () => {
    
    const dbError = new Error('Database connection failed');
    mysql.createConnection.mockRejectedValue(dbError);
    
    
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    
    
    await createAdminScript.createAdmin();
    
   
    expect(console.error).toHaveBeenCalledWith('Error creating admin user:', dbError);
    
    
    expect(mockExit).toHaveBeenCalledWith(1);
    
    
    mockExit.mockRestore();
  });
});
const nodemailer = require('nodemailer');
const emailService = require('../services/emailService');

jest.mock('nodemailer');

describe('Email Service', () => {
  let mockTransporter;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockTransporter = {
      verify: jest.fn().mockResolvedValue(true),
      sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' })
    };
    
    nodemailer.createTransport.mockReturnValue(mockTransporter);
    
    process.env.EMAIL_HOST = 'test.smtp.com';
    process.env.EMAIL_PORT = '587';
    process.env.EMAIL_SECURE = 'false';
    process.env.EMAIL_USER = 'test@example.com';
    process.env.EMAIL_PASS = 'test-password';
    process.env.EMAIL_FROM = 'webshop@test.com';
    process.env.TEST_EMAIL_TO = 'test-recipient@example.com';
    
    console.log = jest.fn();
    console.error = jest.fn();
  });
  
  test('testEmailConnection should verify connection and send test email', async () => {
    const result = await emailService.testEmailConnection();
    
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: 'test.smtp.com',
      port: 587,
      secure: false,
      auth: {
        user: 'test@example.com',
        pass: 'test-password'
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    expect(mockTransporter.verify).toHaveBeenCalled();
    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: 'webshop@test.com',
      to: 'test-recipient@example.com',
      subject: 'Kapcsolat teszt',
      text: 'Ha ezt az e-mailt látja, akkor az e-mail küldés megfelelően működik.'
    });
    
    expect(result).toEqual({ success: true, messageId: 'test-message-id' });
  });
  
  test('testEmailConnection should handle errors', async () => {
    const testError = new Error('SMTP connection failed');
    mockTransporter.verify.mockRejectedValue(testError);
    
    const result = await emailService.testEmailConnection();
    
    expect(result).toEqual({ success: false, error: 'SMTP connection failed' });
    expect(console.error).toHaveBeenCalledWith('E-mail szerver kapcsolat hiba:', testError);
  });
  
  test('sendOrderConfirmation should send order confirmation email', async () => {
    const orderData = {
      id: 12345,
      vevoAdatok: {
        email: 'customer@example.com',
        nev: 'Test Customer',
        szallitasiCim: {
          iranyitoszam: '1234',
          varos: 'Test City',
          utca: 'Test Street',
          hazszam: '42',
          megye: 'Test County'
        },
        telefon: '+36201234567'
      },
      termekek: [
        { termekNev: 'Test Product 1', mennyiseg: 2, ar: 1000 },
        { termekNev: 'Test Product 2', mennyiseg: 1, ar: 2000 }
      ],
      kupon: { kod: 'TEST10' },
      kedvezmeny: 500,
      szallitasiKoltseg: 990,
      vegosszeg: 3490
    };
    
    const result = await emailService.sendOrderConfirmation(orderData);
    
    expect(mockTransporter.sendMail).toHaveBeenCalled();
    expect(mockTransporter.sendMail.mock.calls[0][0]).toMatchObject({
      from: 'webshop@test.com',
      to: 'customer@example.com',
      subject: 'Rendelés visszaigazolás - #12345'
    });
    
    const htmlContent = mockTransporter.sendMail.mock.calls[0][0].html;
    expect(htmlContent).toContain('Test Customer');
    expect(htmlContent).toContain('Test Product 1');
    expect(htmlContent).toContain('Test Product 2');
    expect(htmlContent).toContain('TEST10');
    expect(htmlContent).toContain('3490');
    
    expect(result).toEqual({ success: true, messageId: 'test-message-id' });
  });
  
  test('sendOrderConfirmation should handle missing email address', async () => {
    const orderData = {
      id: 12345,
      vevoAdatok: {},
      termekek: []
    };
    
    const result = await emailService.sendOrderConfirmation(orderData);
    
    expect(result).toEqual({ 
      success: false, 
      error: 'Hiányzó e-mail cím vagy rendelési adatok' 
    });
    expect(mockTransporter.sendMail).not.toHaveBeenCalled();
  });
  
  test('formatAddress should handle different address formats', async () => {
    const formatAddress = emailService.__get__('formatAddress');
    
    const addressObject = {
      szallitasiCim: {
        iranyitoszam: '1234',
        varos: 'Test City',
        utca: 'Test Street',
        hazszam: '42',
        megye: 'Test County'
      }
    };
    
    const addressString = {
      szallitasiCim: JSON.stringify({
        iranyitoszam: '1234',
        varos: 'Test City',
        utca: 'Test Street',
        hazszam: '42',
        megye: 'Test County'
      })
    };
    
    const addressSimple = {
      cim: 'Simple Address'
    };
    
    expect(formatAddress(addressObject)).toBe('1234 Test City, Test Street 42, Test County');
    expect(formatAddress(addressString)).toBe('1234 Test City, Test Street 42, Test County');
    expect(formatAddress(addressSimple)).toBe('Simple Address');
    expect(formatAddress({})).toBe('Nincs megadva');
  });
});
const axios = require('axios');


const testOrder = {
  szallitasiAdatok: {
    nev: "Test User",
    email: "test@example.com",
    telefonszam: "123456789",
    szallitasiCim: "Test Address 123"
  },
  termekek: [
    {
      termek_id: 1,
      mennyiseg: 1,
      ar: 450
    }
  ],
  vegosszeg: 450
};


async function testOrderCreation() {
  try {
    console.log('Sending test order to new endpoint...');
    const response = await axios.post('http://localhost:3001/api/orders/create', testOrder, {
      headers: {
        'Content-Type': 'application/json',
        
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwic3plcmVwa29yIjoiYWRtaW4iLCJpYXQiOjE3NDI0NTc0OTAsImV4cCI6MTc0MjU0Mzg5MH0.L60YZNV9UP-0-un5uxLSYCPPfRlSutapnZ7G2i5-hI4'
      }
    });
    
    console.log('Order created successfully:', response.data);
  } catch (error) {
    console.error('Error creating order:', error.response?.data || error.message);
    console.error('Full error details:', error);
  }
}


testOrderCreation();

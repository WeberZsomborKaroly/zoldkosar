const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

// Get the JWT token from the user data stored in localStorage
const getUserToken = () => {
    try {
        // Read the token from a file for testing purposes
        // In a real application, this would come from localStorage
        if (fs.existsSync('./test-token.txt')) {
            return fs.readFileSync('./test-token.txt', 'utf8').trim();
        }
        return null;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

// Test the admin orders endpoint
const testAdminOrders = async () => {
    try {
        const token = getUserToken();
        if (!token) {
            console.error('No token found. Please create a test-token.txt file with a valid JWT token.');
            return;
        }

        console.log('Using token:', token.substring(0, 20) + '...');

        // Make the request to the admin orders endpoint
        const response = await axios.get('http://localhost:3001/api/admin/orders', {
            headers: {
                'x-access-token': token
            }
        });

        console.log('Response status:', response.status);
        console.log('Response data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error testing admin orders endpoint:');
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
            console.error('Response headers:', error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message);
        }
        console.error('Error config:', error.config);
    }
};

// Execute the test
testAdminOrders();

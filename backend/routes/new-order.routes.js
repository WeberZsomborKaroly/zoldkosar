const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authJwt = require('../middleware/authJwt');

// Create a new order - simplified version with better error handling
router.post('/create', orderController.createOrder);

// Get orders by email
router.get('/user-orders/:email', orderController.getUserOrdersByEmail);

// Log that routes are being registered
console.log("New order routes registered");

module.exports = router;

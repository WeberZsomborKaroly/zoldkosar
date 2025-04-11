const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authJwt = require('../middleware/authJwt');


router.post('/create', orderController.createOrder);


router.get('/user-orders/:email', orderController.getUserOrdersByEmail);


console.log("New order routes registered");

module.exports = router;

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authJwt = require('../middleware/authJwt');


router.use(authJwt.verifyToken, authJwt.isAdmin);


router.get('/stats', adminController.getStats);


router.get('/products/top', adminController.getTopProducts);
router.get('/products', adminController.getProducts);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);


router.get('/categories', adminController.getCategories);


router.get('/orders', adminController.getOrders);
router.get('/orders/:id/items', adminController.getOrderItems);
router.put('/orders/:id', adminController.updateOrderStatus);


router.get('/users', adminController.getUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;

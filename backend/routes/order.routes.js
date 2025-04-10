module.exports = app => {
    const rendeles = require("../controllers/rendeles.controller.js");
    const router = require("express").Router();

    // Create a new order
    router.post("/", rendeles.createOrder);

    // Get all orders
    router.get("/", rendeles.getAllOrders);

    // Get orders by email
    router.get("/email/:email", rendeles.getOrdersByEmail);

    // Get order by ID
    router.get("/:id", rendeles.getOrderById);

    // Update order status
    router.put("/:id/status", rendeles.updateOrderStatus);

    // Log that routes are being registered
    console.log("Rendelés útvonalak regisztrálva az API-ban");

    app.use('/api/rendeles', router);
};

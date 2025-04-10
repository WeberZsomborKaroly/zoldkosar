module.exports = app => {
    const kosar = require("../controllers/kosar.controller.js");
    const { verifyToken } = require("../middleware/auth.js");
    const router = require("express").Router();

    // Get cart items - temporarily removed authentication for testing
    router.get("/", kosar.findAll);

    // Add item to cart - temporarily removed authentication for testing
    router.post("/add", kosar.addItem);

    // Clear all items from cart - temporarily removed authentication for testing
    router.delete("/clear", kosar.clearCart);

    // Update item quantity - temporarily removed authentication for testing
    router.put("/:id", kosar.updateQuantity);

    // Remove item from cart - temporarily removed authentication for testing
    router.delete("/:id", kosar.removeItem);

    app.use('/api/kosar', router);
};

module.exports = app => {
    const kosar = require("../controllers/kosar.controller.js");
    const { verifyToken } = require("../middleware/auth.js");
    const router = require("express").Router();

   
    router.get("/", kosar.findAll);

    
    router.post("/add", kosar.addItem);

    
    router.delete("/clear", kosar.clearCart);

    
    router.put("/:id", kosar.updateQuantity);

   
    router.delete("/:id", kosar.removeItem);

    app.use('/api/kosar', router);
};

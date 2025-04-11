module.exports = app => {
    const rendeles = require("../controllers/rendeles.controller.js");
    const router = require("express").Router();

   
    router.post("/", rendeles.createOrder);

   
    router.get("/", rendeles.getAllOrders);


    router.get("/email/:email", rendeles.getOrdersByEmail);

    
    router.get("/:id", rendeles.getOrderById);

    
    router.put("/:id/status", rendeles.updateOrderStatus);

    
    console.log("Rendelés útvonalak regisztrálva az API-ban");

    app.use('/api/rendeles', router);
};

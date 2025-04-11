const { authJwt } = require("../middleware");

module.exports = app => {
    const kuponok = require("../controllers/kupon.controller.js");
    var router = require("express").Router();

   
    router.post("/", [authJwt.verifyToken, authJwt.isAdmin], kuponok.create);

   
    router.get("/", [authJwt.verifyToken, authJwt.isAdmin], kuponok.findAll);

    
    router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], kuponok.delete);

    
    router.post("/validate/:kod", [authJwt.verifyToken], kuponok.validate);

    
    router.post("/alkalmaz", [authJwt.verifyToken], kuponok.alkalmaz);

    app.use('/api/kuponok', router);
};

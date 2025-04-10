const { authJwt } = require("../middleware");

module.exports = app => {
    const kuponok = require("../controllers/kupon.controller.js");
    var router = require("express").Router();

    // Új kupon létrehozása
    router.post("/", [authJwt.verifyToken, authJwt.isAdmin], kuponok.create);

    // Összes kupon lekérése
    router.get("/", [authJwt.verifyToken, authJwt.isAdmin], kuponok.findAll);

    // Kupon törlése
    router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], kuponok.delete);

    // Kupon érvényesítése
    router.post("/validate/:kod", [authJwt.verifyToken], kuponok.validate);

    // Kupon alkalmazása a kosárra
    router.post("/alkalmaz", [authJwt.verifyToken], kuponok.alkalmaz);

    app.use('/api/kuponok', router);
};

module.exports = app => {
  const termekek = require("../controllers/termek.controller.js");
  const router = require("express").Router();


  router.post("/", termekek.create);

 
  router.get("/", termekek.findAll);


  router.get("/:id", termekek.findOne);


  router.put("/:id", termekek.update);


  router.delete("/:id", termekek.delete);

  app.use('/api/termekek', router);
};

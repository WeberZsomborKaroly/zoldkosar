module.exports = app => {
  const termekek = require("../controllers/termek.controller.js");
  const router = require("express").Router();

  // Create a new Termek
  router.post("/", termekek.create);

  // Retrieve all Termekek
  router.get("/", termekek.findAll);

  // Retrieve a single Termek with id
  router.get("/:id", termekek.findOne);

  // Update a Termek with id
  router.put("/:id", termekek.update);

  // Delete a Termek with id
  router.delete("/:id", termekek.delete);

  app.use('/api/termekek', router);
};

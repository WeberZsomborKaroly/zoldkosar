const db = require('../models');
const Termek = db.Termek;
const Op = db.Sequelize.Op;

// Create and Save a new Termek
exports.create = async (req, res) => {
  try {
    const termek = await Termek.create(req.body);
    res.status(201).json(termek);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Hiba történt a termék létrehozása során."
    });
  }
};

// Retrieve all Termek from the database
exports.findAll = async (req, res) => {
  try {
    const termekek = await Termek.findAll();
    res.json(termekek);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Hiba történt a termékek lekérése során."
    });
  }
};

// Find a single Termek with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const termek = await Termek.findByPk(id);
    if (termek) {
      res.json(termek);
    } else {
      res.status(404).json({
        message: `Nem található termék ezzel az azonosítóval: ${id}`
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Hiba történt a termék lekérése során: " + id
    });
  }
};

// Update a Termek by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await Termek.update(req.body, {
      where: { id: id }
    });

    if (num[0] === 1) {
      res.json({
        message: "A termék sikeresen frissítve."
      });
    } else {
      res.status(404).json({
        message: `Nem sikerült frissíteni a terméket (${id}). Lehet, hogy nem található vagy üres a request body!`
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Hiba történt a termék frissítése során: " + id
    });
  }
};

// Delete a Termek with the specified id
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await Termek.destroy({
      where: { id: id }
    });

    if (num === 1) {
      res.json({
        message: "A termék sikeresen törölve."
      });
    } else {
      res.status(404).json({
        message: `Nem sikerült törölni a terméket (${id}). Lehet, hogy nem található!`
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Hiba történt a termék törlése során: " + id
    });
  }
};

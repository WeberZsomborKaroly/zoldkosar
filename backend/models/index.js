const { Sequelize } = require('sequelize');
const config = require('../config/config.js');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: false // Globally disable timestamps for all models
    }
  }
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import models
db.Felhasznalo = require('./felhasznalo.model.js')(sequelize, Sequelize);
db.Kategoria = require('./kategoria.model.js')(sequelize, Sequelize);
db.Termek = require('./termek.model.js')(sequelize, Sequelize);
db.AruhazAr = require('./aruhaz-ar.model.js')(sequelize, Sequelize);
db.Recept = require('./recept.model.js')(sequelize, Sequelize);
db.Rendeles = require('./rendeles.model.js')(sequelize, Sequelize);
db.RendelesTetelek = require('./rendeles-tetel.model.js')(sequelize, Sequelize);
db.Kosar = require('./kosar.model.js')(sequelize, Sequelize);
db.Kupon = require('./kupon.model.js')(sequelize, Sequelize);

// Define relationships
db.Kategoria.hasMany(db.Termek, { foreignKey: 'kategoria_id' });
db.Termek.belongsTo(db.Kategoria, { foreignKey: 'kategoria_id' });

db.Termek.hasMany(db.AruhazAr, { foreignKey: 'termek_id' });
db.AruhazAr.belongsTo(db.Termek, { foreignKey: 'termek_id' });

db.Felhasznalo.hasMany(db.Rendeles, { foreignKey: 'felhasznalo_id' });
db.Rendeles.belongsTo(db.Felhasznalo, { foreignKey: 'felhasznalo_id' });

db.Rendeles.hasMany(db.RendelesTetelek, { foreignKey: 'rendeles_id' });
db.RendelesTetelek.belongsTo(db.Rendeles, { foreignKey: 'rendeles_id' });

db.Termek.hasMany(db.RendelesTetelek, { foreignKey: 'termek_id' });
db.RendelesTetelek.belongsTo(db.Termek, { foreignKey: 'termek_id' });

db.Felhasznalo.hasMany(db.Kosar, { foreignKey: 'felhasznalo_id' });
db.Kosar.belongsTo(db.Felhasznalo, { foreignKey: 'felhasznalo_id' });

db.Termek.hasMany(db.Kosar, { foreignKey: 'termek_id' });
db.Kosar.belongsTo(db.Termek, { foreignKey: 'termek_id' });

module.exports = db;

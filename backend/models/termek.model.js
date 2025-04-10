module.exports = (sequelize, Sequelize) => {
  const Termek = sequelize.define("termek", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nev: {
      type: Sequelize.STRING,
      allowNull: false
    },
    leiras: {
      type: Sequelize.TEXT
    },
    ar: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    kep: {
      type: Sequelize.STRING
    },
    keszlet: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    kategoria_id: {
      type: Sequelize.INTEGER
    },
    aktiv: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'termekek',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'letrehozva',
    updatedAt: 'modositva'
  });

  return Termek;
};

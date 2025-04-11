module.exports = (sequelize, Sequelize) => {
  const Kategoria = sequelize.define('kategoriak', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nev: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    szulo_kategoria: {
      type: Sequelize.INTEGER,
      references: {
        model: 'kategoriak',
        key: 'id'
      }
    },
    hivatkozas: {
      type: Sequelize.STRING(255)
    },
    tizennyolc_plusz: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'kategoriak',
    freezeTableName: true,
    timestamps: false
  });

  return Kategoria;
};

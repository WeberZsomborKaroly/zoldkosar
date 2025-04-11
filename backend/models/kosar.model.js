module.exports = (sequelize, Sequelize) => {
  const Kosar = sequelize.define("kosar", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    felhasznalo_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    termek_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    mennyiseg: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    tableName: 'kosar',
    freezeTableName: true,
    timestamps: false
  });

  return Kosar;
};

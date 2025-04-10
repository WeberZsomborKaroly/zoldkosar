module.exports = (sequelize, Sequelize) => {
  const Felhasznalo = sequelize.define("felhasznalo", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    jelszo: {
      type: Sequelize.STRING,
      allowNull: false
    },
    vezeteknev: {
      type: Sequelize.STRING
    },
    keresztnev: {
      type: Sequelize.STRING
    },
    admin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    telefon: {
      type: Sequelize.STRING(20),
      allowNull: true
    },
    szerepkor: {
      type: Sequelize.ENUM('user', 'admin'),
      defaultValue: 'user'
    },
    szuletesi_datum: {
      type: Sequelize.DATE
    },
    iranyitoszam: {
      type: Sequelize.INTEGER
    },
    telepules: {
      type: Sequelize.STRING(255)
    },
    kozterulet: {
      type: Sequelize.STRING(255)
    },
    hazszam: {
      type: Sequelize.STRING(50)
    },
    egyeb: {
      type: Sequelize.TEXT
    },
    szamlazasi_nev: {
      type: Sequelize.STRING(255)
    },
    szamlazasi_iranyitoszam: {
      type: Sequelize.INTEGER
    },
    szamlazasi_telepules: {
      type: Sequelize.STRING(255)
    },
    szamlazasi_kozterulet: {
      type: Sequelize.STRING(255)
    },
    szamlazasi_hazszam: {
      type: Sequelize.STRING(50)
    },
    szamlazasi_egyeb: {
      type: Sequelize.TEXT
    },
    adoszam: {
      type: Sequelize.STRING(50)
    },
    szallitasi_adatok: {
      type: Sequelize.JSON,
      allowNull: true
    },
    hirlevel: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    email_megerositva: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    megerosito_token: {
      type: Sequelize.STRING(100)
    },
    token_lejar: {
      type: Sequelize.DATE
    },
    aktiv: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'felhasznalo',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'letrehozva',
    updatedAt: 'utolso_belepes'
  });

  return Felhasznalo;
};

module.exports = (sequelize, Sequelize) => {
    const Recept = sequelize.define('Recept', {
        nev: {
            type: Sequelize.STRING,
            allowNull: false
        },
        leiras: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        elkeszitesi_ido: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        nehezsegi_szint: {
            type: Sequelize.ENUM('könnyű', 'közepes', 'nehéz'),
            allowNull: false
        },
        kep: {
            type: Sequelize.STRING,
            allowNull: true
        }
    });

    return Recept;
};

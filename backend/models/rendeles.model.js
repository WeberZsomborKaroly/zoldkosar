module.exports = (sequelize, Sequelize) => {
    const Rendeles = sequelize.define("rendeles", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        felhasznalo_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'felhasznalok',
                key: 'id'
            }
        },
        osszeg: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        statusz: {
            type: Sequelize.STRING,
            defaultValue: 'feldolgozas_alatt'
        },
        szallitasi_cim: {
            type: Sequelize.TEXT
        }
    }, {
        tableName: 'rendelesek',
        freezeTableName: true
    });

    return Rendeles;
};

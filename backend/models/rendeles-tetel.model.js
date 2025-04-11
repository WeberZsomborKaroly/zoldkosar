module.exports = (sequelize, Sequelize) => {
    const RendelesTetel = sequelize.define("rendeles_tetel", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        rendeles_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'rendelesek',
                key: 'id'
            }
        },
        termek_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'termekek',
                key: 'id'
            }
        },
        mennyiseg: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
        egysegar: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'rendeles_tetelek',
        freezeTableName: true
    });

    return RendelesTetel;
};

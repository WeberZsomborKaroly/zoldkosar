module.exports = (sequelize, Sequelize) => {
    const AruhazAr = sequelize.define('AruhazAr', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        termek_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        ar: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        akcio: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        akcios_ar: {
            type: Sequelize.INTEGER
        }
    }, {
        tableName: 'aruhaz_arak',
        timestamps: true
    });

    return AruhazAr;
};

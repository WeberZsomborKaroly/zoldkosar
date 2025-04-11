module.exports = (sequelize, Sequelize) => {
    const Kupon = sequelize.define("kupon", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        kod: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        kedvezmeny_tipus: {
            type: Sequelize.ENUM('szazalek', 'fix'),
            allowNull: false,
            comment: 'szazalek: százalékos kedvezmény, fix: fix összegű kedvezmény'
        },
        ertek: {
            type: Sequelize.INTEGER,
            allowNull: false,
            comment: 'Százalékos kedvezmény esetén 1-100 közötti érték, fix kedvezmény esetén forint'
        },
        minimum_osszeg: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
            comment: 'Minimális kosárérték, amihez a kupon használható'
        },
        felhasznalhato: {
            type: Sequelize.INTEGER,
            allowNull: true,
            comment: 'Hányszor használható fel a kupon (null = korlátlan)'
        },
        felhasznalva: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Hányszor használták már fel a kupont'
        },
        aktiv: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        ervenyes_kezdete: {
            type: Sequelize.DATE,
            allowNull: true
        },
        ervenyes_vege: {
            type: Sequelize.DATE,
            allowNull: true
        }
    });

    return Kupon;
};

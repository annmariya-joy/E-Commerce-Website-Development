const dbConfig = require('../config/dbConfig.js');

const { Sequelize, DataTypes } = require('sequelize');


const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle

        },
        logging: false//process.env.NODE_ENV == "dev"
    }
)

sequelize.authenticate()
    .then(() => {
        console.log('connected..')
    })
    .catch(err => {

        console.log('error' + err)

    })

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize


db.users = require('./usermodel')(sequelize, DataTypes)

db.products = require('./productmodel')(sequelize, DataTypes)
db.images = require('./imagemodel')(sequelize, DataTypes)


db.carts = require('./cartmodel')(sequelize, DataTypes)

db.orders = require('./ordermodel')(sequelize, DataTypes)



db.userToken = require('./usertokenmodel')(sequelize, DataTypes)



db.users.hasMany(db.carts, {
    foreignKey: 'user_id',
    sourceKey: 'user_id',
});

db.carts.belongsTo(db.users, {
    foreignKey: 'user_id',

});

db.products.hasMany(db.carts, {
    foreignKey: 'product_id',
    sourceKey: 'product_id',
});

db.carts.belongsTo(db.products, {
    foreignKey: 'product_id',
});


db.users.hasMany(db.orders, {
    foreignKey: 'user_id',
    sourceKey: 'user_id',
});
db.orders.belongsTo(db.users, {
    foreignKey: 'user_id',
});



db.carts.hasMany(db.orders, {
    foreignKey: 'cart_id',
    sourceKey: 'cart_id',
});
db.orders.belongsTo(db.carts, {
    foreignKey: 'cart_id',
});
db.products.hasMany(db.orders, {
    foreignKey: 'product_id',
    sourceKey: 'product_id',
});
db.orders.belongsTo(db.products, {
    foreignKey: 'product_id',
});




db.products.hasMany(db.images, {
    foreignKey: 'product_id',
    sourceKey: 'product_id',
});

db.images.belongsTo(db.products, {
    foreignKey: 'product_id',
});





db.sequelize.sync({ force: false })
    .then(() => {
        console.log('yes resync done')
    })

module.exports = db



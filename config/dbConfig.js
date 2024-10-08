// module.exports ={

//     HOST: '217.21.88.6',
//     USER: 'u888961847_khadi_user',
//     PASSWORD:'q3O;UtX^oDTO',
//     DB:'u888961847_khadi_db',
    
//     dialect:'mysql',
    
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     }
//     }

module.exports ={

    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME,
    
    dialect: process.env.DB_DIALECT,
    
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
    }

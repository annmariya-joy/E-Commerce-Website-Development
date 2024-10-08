
const constant = require("../config/utils/constant");
const { v4: uuidv4 } = require('uuid');

module.exports =(sequelize, DataTypes) => {

    const User = sequelize.define("User",{
        user_id:{
            type: DataTypes.UUID,
            defaultValue: uuidv4, // Automatically generate UUID
            primaryKey: true,
            allowNull: false,
            unique: true
         },

            role:{
                type: DataTypes.INTEGER,
                allowNull: true,
             
            },

        user_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
            validate: {
            isEmail: true,
            }
        },
        
        password: {
            type: DataTypes.STRING ,
            allowNull: true
        },
        
     
    }, {
        paranoid: true,
        tableName: 'users', 
        createdAt: 'created_at',
        updatedAt:'updated_at',  
        deletedAt: 'deleted_at', 
    })

  



  return User;
};
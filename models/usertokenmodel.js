const { v4: uuidv4 } = require('uuid');

module.exports =(sequelize, DataTypes) => {

    const UserToken = sequelize.define("UserToken",{
        usertoken_id:{
            type: DataTypes.UUID,
            defaultValue: uuidv4, // Automatically generate UUID
            primaryKey: true,
            allowNull: false,
            unique: true
        },

            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                 model: 'users',
                 key: 'user_id'
                }
             },

        token: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        
    
    }, {
        paranoid: true,
        tableName: 'userToken',
        createdAt: 'created_at',
        updatedAt:'updated_at',
        deletedAt: 'deleted_at',
    })





return UserToken;
};
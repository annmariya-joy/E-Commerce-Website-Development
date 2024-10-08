const constant = require("../config/utils/constant");

module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        order_id: {
            type: DataTypes.UUID, 
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id',
            },
        },
        cart_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'carts', 
            key: 'cart_id'
          },
        },
        product_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'products', 
            key: 'product_id'
          },
        },
        status: {
            type: DataTypes.ENUM(Object.values(constant.OrderStatus)),
            allowNull: false,
            defaultValue: 'pending', // Initial status
        },
        total_amount: {
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: false,
        },
        payment_method: {
            type: DataTypes.ENUM('cash', 'credit_card', 'debit_card'), // Payment options
            allowNull: false,
            defaultValue: 'cash',
        },
        order_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
      
    }, {
        paranoid: true, // Enables soft delete
        tableName: 'orders',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
    });

    return Order;
};

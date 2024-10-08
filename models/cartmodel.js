const { v4: uuidv4 } = require('uuid');
const constant = require("../config/utils/constant");

module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    cart_id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4, // Automatically generate UUID
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    user_id: {
      type: DataTypes.UUID, // Assuming user_id is also a UUID
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    product_id: {
      type: DataTypes.UUID, // Assuming variant_id is also a UUID
      allowNull: false,
      references: {
        model: 'products',
        key: 'product_id'
      }
    },
    status: {
      type: DataTypes.ENUM(Object.values(constant.CartStatus)),
      allowNull: true,
      defaultValue: 'on_cart'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  
  }, {
    paranoid: true,
    tableName: 'carts', 
    createdAt: 'created_at', 
    updatedAt: 'updated_at', 
    deletedAt: 'deleted_at', 
  });

  return Cart;
};

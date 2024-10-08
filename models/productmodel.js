// models/Product.js

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    product_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Correct UUID generation
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    product_name: {
      type: DataTypes.STRING(255), // Define max length
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 255] // Ensure name is between 2 and 255 characters
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    original_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0
      }
    },
    discount_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        isDecimal: true,
        min: 0,
        isLessThanOriginal(value) {
          if (value && this.original_price && parseFloat(value) > parseFloat(this.original_price)) {
            throw new Error('Discount price cannot exceed the original price.');
          }
        }
      }
    },
    selling_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0,
        // Ensure selling_price is correct based on discount
        isValidSellingPrice(value) {
          if (this.discount_price) {
            if (parseFloat(value) !== parseFloat(this.discount_price)) {
              throw new Error('Selling price must match the discount price.');
            }
          } else {
            if (parseFloat(value) !== parseFloat(this.original_price)) {
              throw new Error('Selling price must match the original price.');
            }
          }
        }
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: true,
        min: 0
      }
    },
    uom: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50]
      }
    },
    hsn_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        isNumeric: true
      }
    },
  }, {
    paranoid: true, // Enable soft deletes
    tableName: 'products',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });


  return Product;
};

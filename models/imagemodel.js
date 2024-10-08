// models/Image.js

module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
    image_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Automatically generate UUID
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'products', // Table name in lowercase and plural
        key: 'product_id'
      },
      onDelete: 'CASCADE' // Deletes images if the associated product is deleted
    },
    image_url: {
      type: DataTypes.TEXT, // Use TEXT to accommodate longer URLs if necessary
      allowNull: false,
      validate: {
        isUrl: true
      }
    },
  }, {
    paranoid: true, // Enable soft deletes
    tableName: 'images',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });

 

  return Image;
};

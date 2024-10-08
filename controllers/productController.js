const db = require("../models");


const { Op } = require("sequelize");
const {uploadImagesAndGetPaths} = require('../config/utils/uploadMiddleware');
const { upload, uploadCopyFolder, copyFileToUploadCopyFolder  } = require('../controllers/multer');
const path = require('path');
const fs = require('fs');

const createProduct = async (req, res) => {
  const {
    product_name,
    description,
    original_price,
    discount_price,
    selling_price,
    quantity,
    uom,
    hsn_code,
 
  } = req.body;

 

  try {
    // Validate required fields
    if (!product_name || !description || !original_price || !selling_price || !quantity || !uom) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Check if images are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded.' });
    }

    // Create the product
    const product = await db.products.create({
      product_name,
      description,
      original_price,
      discount_price,
      selling_price,
      quantity,
      uom,
      hsn_code,
  
    });

    // Process and associate images
    const imageInstances = req.files.map(file => ({
      product_id: product.product_id,
      image_url: `${uploadCopyFolder}/${path.basename(file.path)}`
    }));

    await Image.bulkCreate(imageInstances);

  

    // Fetch the product with associated images
    const createdProduct = await db.products.findOne({
      where: { product_id: product.product_id },
      include: [{ model: Image, as: 'images' }]
    });

    res.status(201).json({
      message: "Product created successfully.",
      data: product
    });
  } catch (error) {
  
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Unable to create product', details: error.message });
  }
};



const getAllProducts = async (req, res) => {
  try {
    const PAGE_SIZE = parseInt(req.query.pagesize) || 10; // Number of products per page
    const page = parseInt(req.query.page) || 1; // Current page number
    const offset = (page - 1) * PAGE_SIZE; // Calculate offset

    const { count, rows: products } = await db.products.findAndCountAll({
      where: { deleted_at: null },
      limit: PAGE_SIZE,
      offset: offset,
      order: [['created_at', 'DESC']], // Order by creation date descending
      include: [
        {
          model: db.images,
          attributes: ['image_id', 'image_url']
        },
        // Include other associations like Category if applicable
      ],
      distinct: true // Ensures correct count when including associations
    });

    const totalPages = Math.ceil(count / PAGE_SIZE);

    res.status(200).json({
      data: products,
      currentPage: page,
      totalPages,
      totalProducts: count
    });
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ error: 'Unable to fetch products', details: error.message });
  }
};

// Get a specific product by ID
const getProductById = async (req, res) => {
  const productId = req.params.productId; // Extract product ID from request parameters

  try {
    // Fetch the product by primary key (product_id)
    const product = await db.products.findByPk(productId, {
      where: { deleted_at: null } // Ensure the product is not soft-deleted
    });

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Return the product details
    return res.status(200).json({ data: product });
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ error: 'Unable to fetch product', error });
  }
};






module.exports = {
  createProduct,
  getAllProducts,

  getProductById,

};

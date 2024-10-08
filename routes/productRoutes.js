

const express = require('express');
const {upload} = require('../config/utils/uploadMiddleware');
const { authenticateAccessToken } = require('../config/utils/auth');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,

  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// Create a new product
router.post('/createProduct', authenticateAccessToken, createProduct);


router.get('/getAllProducts', authenticateAccessToken, getAllProducts);

// Get a specific product by ID
router.get('/:productId',authenticateAccessToken, getProductById);



module.exports = router;
const express = require('express');
const router = express.Router();

const {
    addToCart,
   getCartItems,

  } = require('../controllers/cartController');
  const { authenticateAccessToken } = require('../config/utils/auth');

// Route to create a new cart item
router.post('/addCart',authenticateAccessToken, addToCart);

// Route to get all cart items for a user
router.get('/users/getcart', authenticateAccessToken,getCartItems);



module.exports = router;

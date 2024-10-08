const express = require('express');
const router = express.Router();

const {
    placeOrder,getOrderSummary

  } = require('../controllers/orderController');
  const { authenticateAccessToken } = require('../config/utils/auth');

// Route to create a new cart item
router.post('/placeOrder',authenticateAccessToken, placeOrder);

// Route to get all cart items for a user
router.get('/users/getOrderSummary', authenticateAccessToken,getOrderSummary);



module.exports = router;

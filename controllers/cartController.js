const db = require('../models');



// Function to create a new cart item
const addToCart = async (req, res) => {
  try {
    const {  product_id, quantity } = req.body;
    let newquantity = 0;
    const product = await db.products.findByPk(product_id);
        if (!product ) {
          return res.status(404).json({ error: 'product not found' });
        }
    const existingCartItem = await db.carts.findOne({
      where: {
        user_id: req.user.userId,
        product_id,
        status:"on_cart"
             }
        });
    if (existingCartItem) {
      newquantity = parseInt(existingCartItem.quantity) + parseInt(quantity);
        if (product.quantity > newquantity) {
          existingCartItem.quantity = newquantity;
          await existingCartItem.save();

        res.status(200).json({message: 'item carted successfully.',data:{cartItem:existingCartItem}});
      } else {
        return res.status(400).json({ message: 'Insufficient variant quantity.' });
      }
    } else{
      if (product.quantity > quantity) {
        const cartItem = await db.carts.create({
        user_id: req.user.userId,
        product_id,
        quantity
        });
       
    res.status(200).json({message: 'item carted successfully.',data:{cartItem}});
    }else{
     
      return res.status(400).json({ message: 'Insufficient variant quantity.' });
    }
 }}catch (error) {
    console.log(error.stack);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
 };
 

 
const getCartItems = async (req, res) => {
  try {
    const cartItems = await db.carts.findAndCountAll({
      where: {
        user_id: req.user.userId,
        status: 'on_cart',
      },
      include: [
        {
          model: db.products, // Include products
        
          include: [
            {
              model: db.images, // Include images from the Product
            
              attributes: ['image_id', 'image_url'],
            },
          ],
        },
      ],
    });


    if (cartItems.count === 0) {
      // If the cart is empty, return a custom message
      return res.status(200).json({ message: 'Cart is empty' });
    }

    let totalPrice = 0;
    const result = [];

    for (const cartItem of cartItems.rows) {
      const productId = cartItem?.product_id;
      

      totalPrice += cartItem.Product.selling_price *cartItem.quantity;
      const outOfStock = cartItem.quantity > cartItem.Product.quantity;
      result.push({
        cart: cartItem,
 
        outOfStock,
      });
    }
    res.status(200).json({
      message: 'Cart items retrieved successfully',
      data: { cartItems:result, totalPrice: totalPrice },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve cart items' });
  }
}; 


module.exports = {
  addToCart,
  getCartItems,

};



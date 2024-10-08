const { Op } = require('sequelize');
const db = require('../models'); // Adjust the path as needed
const { OrderStatus } = require('../config/utils/constant');

const placeOrder = async (req, res) => {
    const userId = req.user.userId; 
    const { cart_id } = req.body;

    try {
        // Fetch the cart item for the user
        const cartItem = await db.carts.findOne({
            where: {
                cart_id: cart_id,
                status: 'on_cart',
            },
            include: [
                {
                    model: db.products,
                    attributes: ['product_id', 'selling_price', 'product_name'] // Include necessary product fields
                }
            ],
        });

        if (!cartItem) {
            return res.status(400).json({ message: 'Cart is empty. Cannot place order.' });
        }

        // Calculate total amount (assuming a single cart item is fetched)
        const totalAmount = cartItem.Product.selling_price * cartItem.quantity;

        const currentDate = new Date();

        // Create new order
        const newOrder = await db.orders.create({
            user_id: userId,
            cart_id: cart_id,
            product_id:cartItem.Product.product_id,
            status: OrderStatus.Paid, // Ensure this is imported correctly
            total_amount: totalAmount,
            payment_method: "cash",
            order_at: currentDate
        });

        // Clear the cart (optional)
        await db.carts.destroy({
            where: {
                cart_id: cart_id,
                status: 'on_cart',
            },
        });

        res.status(201).json({
            message: 'Order placed successfully',
            data: newOrder,
        });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ error: 'Failed to place order' });
    }
};


const getOrderSummary = async (req, res) => {
    const orderId = req.body.order_id; // Assuming the order ID is passed as a URL parameter

    try {
        // Fetch order details along with related cart items and product details
        const orderSummary = await db.orders.findOne({
            where: { order_id: orderId }, // Ensure this matches your order model's primary key

        });
        const product = await db.products.findOne({
            where: { product_id: orderSummary.product_id }, // Ensure this matches your order model's primary key

        });

        // Check if order exists
        if (!orderSummary) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({
            message: 'Order summary retrieved successfully',
            data: orderSummary,product
        });
    } catch (error) {
        console.error('Error retrieving order summary:', error);
        res.status(500).json({ error: 'Failed to retrieve order summary' });
    }
};


module.exports = {
    placeOrder,getOrderSummary
};

module.exports = Object.freeze({
    OrderStatus: {
        Created:"created",
        Paid: "paid",
        Cancelled: "cancelled",
        Pending: "pending",
        Processing:"processing"
    },

    Role: {
        Admin:1,
        user: 2,
      
    },

    
    CartStatus: {
        Move_to_order:"move_to_order",
        On_cart: "On_cart",
        
    },
    PaymentStatus: {
        Created:"created",
        Completed: "completed",
        Failed: "Failed"
    },
})
import catchAysncErrors from "../middlewares/catchAysncErrors.js";
import Product from "../models/product.js";
import Order from  '../models/order.js';
import ErrorHandler from "../utils/errorHandler.js";


//create new order => /api/v1/orders/new

export const newOrder =catchAysncErrors(async (req, res, next) => {
    try {
        const {
            orderItems,
            shippingInfo,
            itemsPrice,
            taxAmount,
            shippingAmount,
            totalAmount,
            paymentMethod,
            paymentInfo,
        } = req.body;

        const order = await Order.create({
            orderItems,
            shippingInfo,
            itemsPrice,
            taxAmount,
            shippingAmount,
            totalAmount,
            paymentMethod,
            paymentInfo,
            user: req.user._id,
        });

        res.status(200).json({
            order,
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        // Handle other types of errors
        next(error);
    }
});


//api/v1/me/orders
export const myOrders =catchAysncErrors(async(req,res,next)=>
{

    const order = await Order.find({user: req.user._id});
    res.status(200).json({
    order,
})


});

//api/vi/orders/:id

export const getOrderDetails =catchAysncErrors(async(req,res,next)=>
{

    const order = await Order.findById(req.params.id).populate("user", "name");
    if(!order)
    {
        return next(new ErrorHandler('No order found in this id',404))
}
res.status(200).json({
    order,
})


});

//api/v1/admin/orders
export const allOrders =catchAysncErrors(async(req,res,next)=>
{

    const order = await Order.find();
    res.status(200).json({
    order,
})


});

//api/v1/admin/orders/:id
export const updateOrder = catchAysncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler("No order found with this id", 404));
    }
    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("This order has already been delivered", 400));
    }

    for (const item of order.orderItems) {
        const product = await Product.findById(item.product.toString()); // Corrected variable name and method call
        if (product) {
            product.stock -= item.Quantity;
            await product.save({ validateBeforeSave: false });
        }
    }

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();

    await order.save();

    res.status(200).json({
        success: true
    });
});

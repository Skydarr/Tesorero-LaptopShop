const OrderService = require("../models/orderservice");
const Service = require("../models/service");
const ErrorHandler = require("../utils/errorHandler");

// Create a new order   =>  /api/v1/order/new
exports.newOrders = async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
    } = req.body;

    const orders = await OrderService.create({
        orderItems,

        shippingInfo,

        itemsPrice,

        taxPrice,

        shippingPrice,

        totalPrice,

        paymentInfo,

        paidAt: Date.now(),

        user: req.user._id,
    });

    res.status(200).json({
        success: true,

        orders,
    });
};

exports.getSingleOrders = async (req, res, next) => {
    const orders = await OrderService.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if (!orders) {
        return next(new ErrorHandler("No Order found with this ID", 404));
    }

    res.status(200).json({
        success: true,

        orders,
    });
};

exports.myOrderss = async (req, res, next) => {
    const orderss = await OrderService.find({ user: req.user._id });

    // console.log(req.user)

    res.status(200).json({
        success: true,

        orderss,
    });
};

//Admin Access
exports.allOrderss = async (req, res, next) => {
    const orderss = await OrderService.find();

    // console.log(orders)

    let totalAmount = 0;

    orderss.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,

        totalAmount,

        orderss,
    });
};

// async function updateStock(id, quantity) {
//     const service = await Service.findById(id);
//     // console.log(product);
//     product.stock = product.stock - quantity;

//     await product.save({ validateBeforeSave: false });
// }

exports.updateOrders = async (req, res, next) => {
    const orders = await OrderService.findById(req.params.id);

    if (orders.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order", 400));
    }

    // order.orderItems.forEach(async (item) => {
    //     await updateStock(item.service, item.quantity);
    // });

    (order.orderStatus = req.body.status), (order.deliveredAt = Date.now());

    await orders.save();

    res.status(200).json({
        success: true,
    });
};

exports.deleteOrders = async (req, res, next) => {
    const orders = await OrderService.findById(req.params.id);

    if (!orders) {
        return next(new ErrorHandler("No Order found with this ID", 404));
    }

    await orders.remove();

    res.status(200).json({
        success: true,
    });
};

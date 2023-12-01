const Order = require("../models/order");
const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");

// Create a new order   =>  /api/v1/order/new
exports.newOrder = async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
    } = req.body;

    const order = await Order.create({
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

        order,
    });
};

exports.getSingleOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if (!order) {
        return next(new ErrorHandler("No Order found with this ID", 404));
    }

    res.status(200).json({
        success: true,

        order,
    });
};

exports.myOrders = async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    // console.log(req.user)

    res.status(200).json({
        success: true,

        orders,
    });
};

//Admin Access
exports.allOrders = async (req, res, next) => {
    const orders = await Order.find();

    // console.log(orders)

    let totalAmount = 0;

    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    });
};

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    // console.log(product);
    product.stock = product.stock - quantity;

    await product.save({ validateBeforeSave: false });
}

exports.updateOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order", 400));
    }

    order.orderItems.forEach(async (item) => {
        await updateStock(item.product, item.quantity);
    });

    (order.orderStatus = req.body.status), (order.deliveredAt = Date.now());

    await order.save();

    res.status(200).json({
        success: true,
    });
};

exports.deleteOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("No Order found with this ID", 404));
    }

    await Order.findByIdAndRemove(req.params.id);

    res.status(200).json({
        success: true,
    });
};

//Admin Access - Charts 
exports.salesPerMonth = async (req, res, next) => {
    const salesPerMonth = await Order.aggregate([
        {
            $group: {
                // _id: {month: { $month: "$paidAt" } },
                _id: { year: { $year: "$paidAt" }, month: { $month: "$paidAt" } },
                total: { $sum: "$totalPrice" },
            },
        },

        {
            $addFields: {
                month: {
                    $let: {
                        vars: {
                            monthsInString: [, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', ' Sept', 'Oct', 'Nov', 'Dec']
                        },
                        in: {
                            $arrayElemAt: ['$$monthsInString', "$_id.month"]
                        }
                    }
                }
            }
        },
        { $sort: { "_id.month": 1 } },
        {
            $project: {
                _id: 1,
                month: 1,

                total: 1,

            }
        }

    ])
    if (!salesPerMonth) {
        return next(new ErrorHandler('error sales per month', 404))

    }
    // return console.log(customerSales)
    res.status(200).json({
        success: true,
        salesPerMonth
    })

}

exports.customerSales = async (req, res, next) => {
    const customerSales = await Order.aggregate([

        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userDetails'
            },
        },

        { $unwind: "$userDetails" },

        {
            $group: {
                _id: "$user",
                total: { $sum: "$totalPrice" },
                doc: { "$first": "$$ROOT" },

            }
        },

        {
            $replaceRoot: {
                newRoot: { $mergeObjects: [{ total: '$total' }, '$doc'] },
            },
        },

        { $sort: { total: -1 } },
        {
            $project: {
                _id: 0,
                "userDetails.name": 1,
                total: 1,

            }
        }

    ])
    if (!customerSales) {
        return next(new ErrorHandler('error customer sales', 404))

    }
    // return console.log(customerSales)
    res.status(200).json({
        success: true,
        customerSales
    })

}
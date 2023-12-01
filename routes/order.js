const express = require("express");
const router = express.Router();

const {
    newOrder,
    getSingleOrder,
    myOrders,
    allOrders,
    updateOrder,
    deleteOrder,
    salesPerMonth,
    customerSales
} = require("../controllers/orderController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/orders/me").get(isAuthenticatedUser, myOrders);
router
    .route("/admin/orders/")
    .get(isAuthenticatedUser, authorizeRoles("admin"), allOrders);
router
    .route("/admin/order/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder);

router
    .route("/admin/order/:id")
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

router.get('/orders/customer-sales', isAuthenticatedUser, authorizeRoles("admin"), customerSales);
router.get('/orders/sales-per-month', isAuthenticatedUser, authorizeRoles("admin"), salesPerMonth);
module.exports = router;
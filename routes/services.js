const express = require("express");
const router = express.Router();

const {
    newOrders,
    getSingleOrders,
    myOrderss,
    allOrderss,
    updateOrders,
    deleteOrders,
} = require("../controllers/orderServiceController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.route("/orderservice/new").post(isAuthenticatedUser, newOrder);
router.route("/orderservice/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/ordersservice/me").get(isAuthenticatedUser, myOrders);
router
    .route("/admin/ordersservice/")
    .get(isAuthenticatedUser, authorizeRoles("admin"), allOrders);
router
    .route("/admin/orderservice/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder);

router
    .route("/admin/orderservice/:id")
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
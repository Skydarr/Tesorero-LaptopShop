const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const {
    isAuthenticatedUser,
    authorizeRoles,
} = require("../middlewares/auth");

const {
    newService,
    getService,
    getSingleService,
    updateService,
    deleteService,
    createServiceReviews,
    getServiceReviews,
    // createServiceReviews
} = require("../controllers/serviceController");

//Admin Access
router.post("/service/new", isAuthenticatedUser, authorizeRoles("admin"), upload.array("images", 10), newService);
router.get("/services", getService);
router.get("/service/:id", getSingleService);
router.put("/update/service/:id", isAuthenticatedUser, authorizeRoles("admin"), upload.array("images", 10), updateService);
router.delete("/remove/service/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteService);

//User Access 
router.put("/create/service/review", isAuthenticatedUser, createServiceReviews);
// router.get("/service/review/:id", isAuthenticatedUser, getServiceReviews);
// router.delete("/remove/review/:id", isAuthenticatedUser, deleteReview);
router.get("/service/reviews", isAuthenticatedUser, getServiceReviews);
// router.get("/review/:id", isAuthenticatedUser, getProductReview);
// router.delete("/remove/review/:id", isAuthenticatedUser, deleteReview);

module.exports = router;
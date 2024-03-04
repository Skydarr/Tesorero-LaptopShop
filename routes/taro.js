const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const {
    isAuthenticatedUser,
    authorizeRoles,
} = require("../middlewares/auth");

const {
    newPost,
    getPosts,
    getSinglePost,
    updatePost,
    deletePost,
    createPostReview,
    getPostReviews,
    deleteReview,
    allPosts,
    Taro
} = require("../controllers/taroController");

//Admin Access
router.post("/taro/new", isAuthenticatedUser, authorizeRoles("admin"), upload.array("images", 10), newPost);
router.get("/taro", getPosts);
router.get("/taro/:id", getSinglePost);
router.put("/update/taro/:id", isAuthenticatedUser, authorizeRoles("admin"), upload.array("images", 10), updatePost);
router.delete("/remove/taro/:id", isAuthenticatedUser, authorizeRoles("admin"), deletePost);
router.get("/admin/taroposts", isAuthenticatedUser, authorizeRoles("admin"), allPosts);

//User Access 
router.put("/create/review", isAuthenticatedUser, createPostReview);
router.get("/reviews", isAuthenticatedUser, getPostReviews);
router.delete("/remove/review/:id", isAuthenticatedUser, deleteReview);

module.exports = router;
const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const {
    registerUser,
    loginUser,
    logout,
    resetPassword,
    forgotPassword,
    getUserProfile,
    updateProfile,
    updatePassword,
    allUsers,
    getUserDetails,
    updateUser,
    deleteUser, 
    googlelogin
} = require("../controllers/authController");

const {
    isAuthenticatedUser,
    authorizeRoles,
} = require("../middlewares/auth");

router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.route("/logout").get(logout);

//Password
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.put("/password/update", isAuthenticatedUser, updatePassword);

//Profile
router.get("/profile", isAuthenticatedUser, getUserProfile);
router.put(
    "/profile/update",
    isAuthenticatedUser,
    upload.single("avatar"),
    updateProfile
);


// Admin Controls
router.get("/admin/users", isAuthenticatedUser, authorizeRoles("admin"), allUsers);
router.get("/admin/users/:id", isAuthenticatedUser, authorizeRoles("admin"), getUserDetails);
router.put("/admin/users/update/:id", isAuthenticatedUser, authorizeRoles("admin"), updateUser);
router.delete("/admin/users/remove/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

//Google Login
router.post("/googlelogin", googlelogin);

module.exports = router;
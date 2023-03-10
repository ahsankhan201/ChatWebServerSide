// Import the necessary functions from userController
const {
  login,
  register,
  getAllUsers,
  setAvatar,
  logOut,
} = require("../controller/userController");

// Import the Express router module
const router = require("express").Router();

// Create the routes for the various user actions
router.post("/login", login); // User login
router.post("/register", register); // User registration
router.get("/allusers/:id", getAllUsers); // Get all users (requires an ID parameter)
router.post("/setavatar/:id", setAvatar); // Set user avatar (requires an ID parameter)
router.get("/logout/:id", logOut); // User logout (requires an ID parameter)

// Export the router module
module.exports = router;

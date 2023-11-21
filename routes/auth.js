const express = require("express");
const router = express.Router();

// Require controller modules.
const user_controller = require("../controllers/userController");
const authentication_controller = require("../controllers/authenticationController");

/// AUTHENTICATION ROUTES ///

// GET request for getting verify authentication.
router.get("/verify-authentication/:id", authentication_controller.get_verify_authentication);
// GET request for list of all authentication items.
router.get("/list-authentications", authentication_controller.list_authentications);
// POST request for creating an authentication ticket.
router.post("/authenticate", authentication_controller.post_authentication);

/// USER ROUTES ///

// GET request for getting one user.
router.get("/one-user/:id", user_controller.get_one_user);
// GET request for list of all user items.
router.get("/list-users", user_controller.list_users);
// POST request for creating a user.
router.post("/create-user", user_controller.post_user);
// DELETE request to delete user.
router.post("/delete-user/:id", user_controller.post_delete_user);
// UPDATE request to update user.
router.post("/update-user/:id", user_controller.post_update_user);

module.exports = router;

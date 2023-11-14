const User = require("../models/users");
const asyncHandler = require("express-async-handler");

// Display list of all Users.
exports.users_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: User list");
});

// Display detail page for a specific User.
exports.user_info = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: User detail: ${req.params.id}`);
});

// Handle User create.
exports.user_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: User create");
});

// Handle User delete.
exports.user_delete = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: User delete");
});

// Handle User update.
exports.user_update = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: User update");
});

const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { DateTime } = require("luxon");

exports.index = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Site Home Page");
});

// Display detail for a specific user.
exports.get_one_user = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).exec();

    if (user === null) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }

    return res.status(200).json(user)
  } catch (error) {
    console.log('error: ', error)
    const err = new Error("Error when trying to get one user.");
    err.status = 400;
    return next(err);
  }
});

// Display list of all users.
exports.list_users = asyncHandler(async (req, res, next) => {
  try {
    const allUsers = await User.find({}, "created_at name login password status type updated_at")
      .sort({ name: 1 })
      .exec();

    return res.status(200).json(allUsers)
  } catch (error) {
    console.log('error: ', error)
    const err = new Error("Error when trying to get all users.");
    err.status = 400;
    return next(err);
  }
});

// Handle user create on POST.
exports.post_user = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Name can't be empty.")
    .isAlpha()
    .withMessage("Name must be alphabet letters."),

  body("login")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Login can't be empty."),

  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password can't be empty."),

  asyncHandler(async (req, res, next) => {
    try {
      const errors = validationResult(req);
      const hashedPassword = await bcrypt.hash(req.body.authentication.password, 10);
      const user = new User({
        created_at: req.body.user.created_at,
        name: req.body.user.name,
        login: req.body.user.login,
        password: hashedPassword,
        status: req.body.user.status,
        type: req.body.user.type,
        updated_at: req.body.user.updated_at
      });

      // Handle empty date values
      if (user != null) {
        if (!user.created_at)
          user.created_at = DateTime.now()
        if (!user.updated_at)
          user.updated_at = DateTime.now()
      }

      if (errors.isEmpty()) {
        const err = new Error("Invalid User fields!");
        err.status = 400;
        return next(err);
      } else {
        const userExists = await User.findOne({ name: req.body.user.name }).exec();
        if (userExists) {
          const err = new Error("User already exists!");
          err.status = 400;
          return next(err);
        } else {
          await user.save();
          res.status(200).json(user)
        }
      }
    } catch (error) {
      console.log('error: ', error)
      const err = new Error("Error when trying to save a new user.");
      err.status = 400;
      return next(err);
    }
  }),
];

// Handle user delete on POST.
exports.post_delete_user = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).exec();

    if (user === null) {
      const err = new Error("User doesn't exists.");
      err.status = 404;
      return next(err);
    }

    await User.findByIdAndRemove(user._id);
    return res.status(200).json({})
  } catch (error) {
    console.log('error: ', error)
    const err = new Error("Error when trying to delete a user.");
    err.status = 400;
    return next(err);
  }
});

// Handle user update on POST.
exports.post_update_user = [
  (req, res, next) => {
    if (!(req.body.user instanceof Array)) {
      if (typeof req.body.user === "undefined") {
        req.body.user = [];
      } else {
        req.body.user = new Array(req.body.user);
      }
    }
    next();
  },

  // Validate and sanitize fields.
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body("login")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Login can't be empty."),

  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password can't be empty."),

  asyncHandler(async (req, res, next) => {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);

      // Create a User object with escaped/trimmed data and old id.
      const user = new User({
        description: req.body.user[0].description,
        name: req.body.user[0].name,
        login: req.body.user[0].login,
        password: req.body.user[0].password,
        status: req.body.user[0].status,
        type: req.body.user[0].type,
        updated_at: DateTime.now(), // new updated_at date
        _id: req.params.id // This is required, or a new ID will be assigned!
      });

      if (errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/error messages.
        const err = new Error("Invalid User fields to update!");
        err.status = 400;
        return next(err);
      } else {
        // Data from form is valid. Update the item.
        const current_user = await User.findByIdAndUpdate(req.params.id, user, {});
        res.status(201).json(user)
      }
    } catch (error) {
      console.log('error: ', error)
      const err = new Error("Error when trying to update a user.");
      err.status = 400;
      return next(err);
    }
  }),
];

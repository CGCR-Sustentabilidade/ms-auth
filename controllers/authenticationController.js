const Authentication = require("../models/authentication");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { DateTime } = require("luxon");
const bcrypt = require('bcrypt');

exports.index = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Site Home Page");
});

// Display detail for a specific authentication.
exports.get_verify_authentication = asyncHandler(async (req, res, next) => {
  try {
    const authentication = await Authentication.findById(req.params.id).exec();

    if (authentication === null) {
      const err = new Error("Authentication not found");
      err.status = 404;
      return next(err);
    }

    return res.status(200).json(authentication)
  } catch (error) {
    console.log('error: ', error)
    const err = new Error("Error when trying to get one authentication.");
    err.status = 400;
    return next(err);
  }
});

// Display list of all authentications.
exports.list_authentications = asyncHandler(async (req, res, next) => {
  try {
    const allAuthentications = await Authentication.find({}, "created_at name login password status type updated_at")
      .sort({ name: 1 })
      .exec();

    return res.status(200).json(allAuthentications)
  } catch (error) {
    console.log('error: ', error)
    const err = new Error("Error when trying to get all authentications.");
    err.status = 400;
    return next(err);
  }
});

// Handle authentication create on POST.
exports.post_authentication = [
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
      const authentication = new Authentication({
        created_at: req.body.authentication.created_at,
        name: req.body.authentication.name,
        login: req.body.authentication.login,
        password: hashedPassword,
        status: req.body.authentication.status,
        type: req.body.authentication.type,
        updated_at: req.body.authentication.updated_at
      });

      // Handle empty date values
      if (authentication != null) {
        if (!authentication.created_at)
          authentication.created_at = DateTime.now()
        if (!authentication.updated_at)
          authentication.updated_at = DateTime.now()
      }

      if (errors.isEmpty()) {
        const err = new Error("Invalid Authentication fields!");
        err.status = 400;
        return next(err);
      } else {
        const authenticationExists = await Authentication.findOne({ name: req.body.authentication.name }).exec();
        if (authenticationExists) {
          const err = new Error("Authentication already exists!");
          err.status = 400;
          return next(err);
        } else {
          await authentication.save();
          res.status(200).json(authentication)
        }
      }
    } catch (error) {
      console.log('error: ', error)
      const err = new Error("Error when trying to save a new authentication.");
      err.status = 400;
      return next(err);
    }
  }),
];

// Handle authentication delete on POST.
exports.post_delete_authentication = asyncHandler(async (req, res, next) => {
  try {
    const authentication = await Authentication.findById(req.params.id).exec();

    if (authentication === null) {
      const err = new Error("Authentication doesn't exists.");
      err.status = 404;
      return next(err);
    }

    await Authentication.findByIdAndRemove(authentication._id);
    return res.status(200).json({})
  } catch (error) {
    console.log('error: ', error)
    const err = new Error("Error when trying to delete a authentication.");
    err.status = 400;
    return next(err);
  }
});

// Handle authentication update on POST.
exports.post_update_authentication = [
  (req, res, next) => {
    if (!(req.body.authentication instanceof Array)) {
      if (typeof req.body.authentication === "undefined") {
        req.body.authentication = [];
      } else {
        req.body.authentication = new Array(req.body.authentication);
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

      // Create a Authentication object with escaped/trimmed data and old id.
      const authentication = new Authentication({
        description: req.body.authentication[0].description,
        name: req.body.authentication[0].name,
        login: req.body.authentication[0].login,
        password: req.body.authentication[0].password,
        status: req.body.authentication[0].status,
        type: req.body.authentication[0].type,
        updated_at: DateTime.now(), // new updated_at date
        _id: req.params.id // This is required, or a new ID will be assigned!
      });

      if (errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/error messages.
        const err = new Error("Invalid Authentication fields to update!");
        err.status = 400;
        return next(err);
      } else {
        // Data from form is valid. Update the item.
        const current_authentication = await Authentication.findByIdAndUpdate(req.params.id, authentication, {});
        res.status(201).json(authentication)
      }
    } catch (error) {
      console.log('error: ', error)
      const err = new Error("Error when trying to update a authentication.");
      err.status = 400;
      return next(err);
    }
  }),
];

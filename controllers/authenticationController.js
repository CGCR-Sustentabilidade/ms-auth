const Authentication = require("../models/authentication");
const Login = require("../models/login");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { DateTime } = require("luxon");
const utils_bcrypt = require("../utils/hash_utils")
const bcrypt = require('bcrypt')

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
    .isLength({ min: 1, max: 30 })
    .withMessage("Login can't be empty or greater than 30 characters."),

  asyncHandler(async (req, res, next) => {
    try {
      const errors = validationResult(req);
      const hashedPasswordToBeCompared = req.body.access_token.password;
      const access_token = new Authentication({
        created_at: req.body.access_token.created_at,
        login: req.body.access_token.login,
        status: req.body.access_token.status,
        access_token: req.body.access_token.access_token,
      });

      // Handle empty date values
      if (access_token != null) {
        if (!access_token.created_at)
          access_token.created_at = DateTime.now()
      }

      if (errors.isEmpty()) {
        const err = new Error("Invalid Authentication fields!");
        err.status = 400;
        return next(err);
      } else {
        const authenticationExists = await Authentication.findOne({ login: req.body.access_token.login }).exec();
        const userExists = await User.findOne({ login: req.body.access_token.login }).exec();
        if (authenticationExists) {
          const err = new Error("Authentication already exists!");
          err.status = 400;
          return next(err);
        } else if(!bcrypt.compareSync(hashedPasswordToBeCompared, userExists.password)) {
            console.log("400 BAD REQUEST Senha errada!")
            const err = new Error("Wrong password!");
            err.status = 400;
            return next(err);
          } else {
            await access_token.save();
            res.status(200).json(access_token)
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

// Login with user credentials.
exports.post_login = [
  body("login")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Login can't be empty or greater than 30 characters."),

  body("password")
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage("Password can't be empty or greater than 20 characters."),

  asyncHandler(async (req, res, next) => {
    try {
      console.log('body', req.body)
      console.log('body.login_user', req.body.login_user)
      const errors = validationResult(req);
      const passwordToBeCompared = req.body.login_user.password;
      const userToBeCompared = new Login({
        login: req.body.login_user.login,
        password: req.body.login_user.password,
      });

      // Handle empty login values
      if (login_user != null) {
        if (!login_user.login)
        login_user.login = "aaaaaaaaaaaa"
      }

      if (errors.isEmpty()) {
        console.log('invalid login fields')
        const err = new Error("Invalid Login fields!");
        err.status = 400;
        return next(err);
      } else {
        const userExists = await User.findOne({ login: req.body.login_user.login }).exec();
        if(!bcrypt.compareSync(passwordToBeCompared, userExists.password)) {
            console.log("Senha errada!")
            const err = new Error("Wrong password!");
            err.status = 400;
            return next(err);
          } else {
            await userToBeCompared.save();
            res.status(200).json(userToBeCompared)
          }
      }
    } catch (error) {
      console.log('error: ', error)
      const err = new Error("Error when trying to LOGIN.");
      err.status = 400;
      return next(err);
    }
  }),
];
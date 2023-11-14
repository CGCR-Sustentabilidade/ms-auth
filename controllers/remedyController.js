const Remedy = require("../models/remedy");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { DateTime } = require("luxon");

exports.index = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Site Home Page");
});

// Display detail for a specific remedy.
exports.get_one_remedy = asyncHandler(async (req, res, next) => {
  try {
    const remedy = await Remedy.findById(req.params.id).exec();

    if (remedy === null) {
      const err = new Error("Remedy not found");
      err.status = 404;
      return next(err);
    }

    return res.status(200).json(remedy)
  } catch (error) {
    console.log('error: ', error)
    const err = new Error("Error when trying to get one remedy.");
    err.status = 400;
    return next(err);
  }
});

// Display list of all remedys.
exports.list_remedys = asyncHandler(async (req, res, next) => {
  try {
    const allRemedys = await Remedy.find({}, "brand created_at description expiration_date name quantity status type updated_at")
      .sort({ name: 1 })
      .exec();

    return res.status(200).json(allRemedys)
  } catch (error) {
    console.log('error: ', error)
    const err = new Error("Error when trying to get all remedys.");
    err.status = 400;
    return next(err);
  }
});

// Handle remedy create on POST.
exports.post_remedy = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Name can't be empty.")
    .isAlpha()
    .withMessage("Name must be alphabet letters."),

  asyncHandler(async (req, res, next) => {
    try {
      const errors = validationResult(req);
      const remedy = new Remedy({
        brand: req.body.remedy.brand,
        created_at: req.body.remedy.created_at,
        description: req.body.remedy.description,
        expiration_date: req.body.remedy.expiration_date,
        name: req.body.remedy.name,
        quantity: req.body.remedy.quantity,
        status: req.body.remedy.status,
        type: req.body.remedy.type,
        updated_at: req.body.remedy.updated_at
      });

      // Handle empty date values
      if (remedy != null) {
        if (!remedy.created_at)
          remedy.created_at = DateTime.now()
        if (!remedy.expiration_date)
          remedy.expiration_date = DateTime.now()
        if (!remedy.updated_at)
          remedy.updated_at = DateTime.now()
      }

      if (errors.isEmpty()) {
        const err = new Error("Invalid Remedy fields!");
        err.status = 400;
        return next(err);
      } else {
        const remedyExists = await Remedy.findOne({ name: req.body.remedy.name }).exec();
        if (remedyExists) {
          const err = new Error("Remedy already exists!");
          err.status = 400;
          return next(err);
        } else {
          await remedy.save();
          res.status(200).json(remedy)
        }
      }
    } catch (error) {
      console.log('error: ', error)
      const err = new Error("Error when trying to save a new remedy.");
      err.status = 400;
      return next(err);
    }
  }),
];

// Handle remedy delete on POST.
exports.post_delete_remedy = asyncHandler(async (req, res, next) => {
  try {
    const remedy = await Remedy.findById(req.params.id).exec();
    if (remedy === null) {
      const err = new Error("Remedy doesn't exists.");
      err.status = 404;
      return next(err);
    }

    await Remedy.findByIdAndRemove(remedy._id);
    return res.status(200).json({})
  } catch (error) {
    console.log('error: ', error)
    const err = new Error("Error when trying to delete a remedy.");
    err.status = 400;
    return next(err);
  }
});

// Handle remedy update on POST.
exports.post_update_remedy = [
  (req, res, next) => {
    if (!(req.body.remedy instanceof Array)) {
      if (typeof req.body.remedy === "undefined") {
        req.body.remedy = [];
      } else {
        req.body.remedy = new Array(req.body.remedy);
      }
    }
    next();
  },

  // Validate and sanitize fields.
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);

      // Create a Remedy object with escaped/trimmed data and old id.
      const remedy = new Remedy({
        brand: req.body.remedy[0].brand,
        created_at: req.body.remedy[0].created_at,
        description: req.body.remedy[0].description,
        expiration_date: req.body.remedy[0].expiration_date,
        name: req.body.remedy[0].name,
        quantity: req.body.remedy[0].quantity,
        status: req.body.remedy[0].status,
        type: req.body.remedy[0].type,
        updated_at: DateTime.now(), // new updated_at date
        _id: req.params.id // This is required, or a new ID will be assigned!
      });

      if (errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/error messages.
        const err = new Error("Invalid Remedy fields to update!");
        err.status = 400;
        return next(err);
      } else {
        // Data from form is valid. Update the item.
        const current_remedy = await Remedy.findByIdAndUpdate(req.params.id, remedy, {});
        res.status(201).json(remedy)
      }
    } catch (error) {
      console.log('error: ', error)
      const err = new Error("Error when trying to update a remedy.");
      err.status = 400;
      return next(err);
    }
  }),
];

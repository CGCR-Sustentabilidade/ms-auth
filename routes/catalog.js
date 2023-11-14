const express = require("express");
const router = express.Router();

// Require controller modules.
const product_controller = require("../controllers/productController");
const elderly_controller = require("../controllers/elderlyController");
const remedy_controller = require("../controllers/remedyController");

/// PRODUCT ROUTES ///

// GET catalog home page.
router.get("/", product_controller.index);

// GET request for getting one Product.
router.get("/one-product/:id", product_controller.get_one_product);
// GET request for list of all Product items.
router.get("/list-products", product_controller.list_products);
// POST request for creating a Product.
router.post("/create-product", product_controller.post_product);
// DELETE request to delete Product.
router.post("/delete-product/:id", product_controller.post_delete_product);
// UPDATE request to update Product.
router.post("/update-product/:id", product_controller.post_update_product);

/// REMEDY ROUTES ///

// GET catalog home page.
router.get("/", remedy_controller.index);

// GET request for getting one Remedy.
router.get("/one-remedy/:id", remedy_controller.get_one_remedy);
// GET request for list of all Remedy items.
router.get("/list-remedys", remedy_controller.list_remedys);
// POST request for creating a Remedy.
router.post("/create-remedy", remedy_controller.post_remedy);
// DELETE request to delete Remedy.
router.post("/delete-remedy/:id", remedy_controller.post_delete_remedy);
// UPDATE request to update Remedy.
router.post("/update-remedy/:id", remedy_controller.post_update_remedy);

/// REMEDY ROUTES ///

// GET catalog home page.
router.get("/", elderly_controller.index);

// GET request for getting one elderly.
router.get("/one-elderly/:id", elderly_controller.get_one_elderly);
// GET request for list of all elderly items.
router.get("/list-elderlys", elderly_controller.list_elderlys);
// POST request for creating a elderly.
router.post("/create-elderly", elderly_controller.post_elderly);
// DELETE request to delete elderly.
router.post("/delete-elderly/:id", elderly_controller.post_delete_elderly);
// UPDATE request to update elderly.
router.post("/update-elderly/:id", elderly_controller.post_update_elderly);

module.exports = router;

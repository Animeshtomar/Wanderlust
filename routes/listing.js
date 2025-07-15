const express= require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { cloudinary, storage } = require("../cloudConfig.js");
const upload = multer({storage});

router.route("/")
.get(
  wrapAsync(listingController.index)  //Index Route
)
.post(
  isLoggedIn,
  validateListing,
  upload.single("listing[image]"),
  wrapAsync(listingController.createListing)  //Create Route
);

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(
  //Show Route
  wrapAsync(listingController.showListing)
)
.put(
  //Update Route
  isLoggedIn,
  validateListing,
  isOwner,
  upload.single("listing[image]"),
  wrapAsync(listingController.updateListing)
)
.delete(
  //Delete Route
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);  

module.exports = router;
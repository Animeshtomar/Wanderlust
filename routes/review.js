const express= require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewsController = require("../controllers/reviews.js");

//Reviews Post Route
router.post("/", validateReview,isLoggedIn, wrapAsync(reviewsController.postReview));

//Reviews delete route 
router.delete("/:reviewid",isLoggedIn,isReviewAuthor, wrapAsync(reviewsController.deleteReview));

module.exports = router;
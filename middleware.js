const { listingSchema } = require("./schema.js");
const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const { reviewSchema } = require("./schema.js");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; //redirect Url
    req.flash("error", "You must be logged in to do that!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl= (req, res, next) => {
  if (req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  };
  next();
};

module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)) {
      req.flash("error", "You do not have permission!");
      return res.redirect(`/listings/${id}`);
    };
    next();
};

//Validation for listing
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let erMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, erMsg);
  } else {
    next();
  }
};

//Validation for reviews
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let erMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, erMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async(req, res, next) => {
    let { id,reviewid } = req.params;
    let review = await Review.findById(reviewid);
    if(!review.author._id.equals(res.locals.currentUser._id)) {
      req.flash("error", "You do not have permission!");
      return res.redirect(`/listings/${id}`);
    };
    next();
};
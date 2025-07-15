const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.postReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id; // Set the author to the current user
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  req.flash("success", "Successfully created a new review!");

  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async(req,res)=>{
    let{id,reviewid}=req.params;
    await Listing.findByIdAndUpdate( id,{$pull: { reviews: reviewid }});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success", "Successfully deleted review!");
    
    res.redirect(`/listings/${id}`);
};
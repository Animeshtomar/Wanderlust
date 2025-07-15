const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geoCodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const Listings = await Listing.find({});
    res.render("listings/index.ejs", { Listings });
};

module.exports.renderNewForm =  (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if (!listing) {
      req.flash("error", "Listing doesn't exist!");
      return res.redirect("/listings");
    };
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    let response = await geoCodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send()
    
    let result = listingSchema.validate(req.body);
    if (result.error) {
      throw new ExpressError(400, result.error);
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // Set the owner to the logged-in user
    if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
      };
    newListing.geometry = response.body.features[0].geometry;
    }
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing doesn't exist!");
      return res.redirect("/listings");
    };
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing");
  }
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save(); 
  }
  req.flash("success", "Successfully updated!");
  res.redirect("/listings");
};


module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
};
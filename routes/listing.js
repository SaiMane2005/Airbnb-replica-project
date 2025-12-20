const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema}=require("../schema.js");
const Review = require("../models/review.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")
const Listing = require("../models/listing.js")
const listingController=require("../controller/listing.js")

// Index route
router.get("/", wrapAsync(listingController.index));

// New route
router.get("/new",isLoggedIn,listingController.renderNewForm);

// Show route
router.get("/:id",wrapAsync(listingController.showListing));

// Create listing route
router.post(
  "/",isLoggedIn,validateListing,
  wrapAsync(listingController.createListing)
);
// Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

// Update route
router.put("/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing));

// Delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.distroyListing));


module.exports=router;
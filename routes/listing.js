const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema}=require("../schema.js");
const Review = require("../models/review.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")
const Listing = require("../models/listing.js")
const listingController=require("../controller/listing.js")
const multer  = require('multer')// handling multipart/form-data
const {storage}=require("../cloudConfig.js")
const upload = multer({storage })//upload the image on the folder wanderlust_DEV in the cloudinary

router
  .route("/")
  .get(wrapAsync(listingController.index))// Index route
  .post(
    isLoggedIn,
    validateListing,
    upload.single('listing[image][url]'),
    wrapAsync(listingController.createListing)// Create listing route
  );


// New route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))// Show route
  .delete(isLoggedIn,isOwner,wrapAsync(listingController.distroyListing))// Delete route
  .put(isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));// Update route

// Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
module.exports=router;
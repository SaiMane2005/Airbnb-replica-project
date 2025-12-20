const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {isLoggedIn,isOwner,validateReview,isReviewAuthor}=require("../middleware.js")
const ReviewController=require("../controller/reviews.js")



router.post("/",isLoggedIn,validateReview,wrapAsync(ReviewController.createReview))

//Delete review route
router.delete("/:reviewID",isLoggedIn,isReviewAuthor, wrapAsync(ReviewController.destroyReview));
module.exports=router;
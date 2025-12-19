const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {isLoggedIn,isOwner,validateReview,isReviewAuthor}=require("../middleware.js")



router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
  let listing=await Listing.findById(req.params.id);
  let newReview=new Review(req.body.review);
  newReview.author=req.user._id;
  listing.review.push(newReview);
  console.log(newReview);

  await newReview.save();
  await listing.save();
  req.flash("success","New Review Created!");
  res.redirect(`/listings/${listing._id}`);
}))

//Delete review route
router.delete("/:reviewID",isLoggedIn,isReviewAuthor, wrapAsync(async (req, res) => {
  let { id, reviewID } = req.params;
  // remove review reference from listing
  await Listing.findByIdAndUpdate(id, { $pull: { review: reviewID } });//pull and delete the review id in the listing document
  // delete review itself
  await Review.findByIdAndDelete(reviewID);
  req.flash("success","Review Deleted");
  res.redirect(`/listings/${id}`);
}));
module.exports=router;
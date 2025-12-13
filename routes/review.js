const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema, reviewSchema}=require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const validateReview =(req,res,next)=>{
   let {error}= reviewSchema.validate(req.body)
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",")
      throw new ExpressError(400,errMsg)
    }else{
      next()
    }
}
router.post("/",validateReview,wrapAsync(async(req,res)=>{
  let listing=await Listing.findById(req.params.id);
  let newReview=new Review(req.body.review);
  listing.review.push(newReview);

  await newReview.save();
  await listing.save();
  console.log("new review saved");
  req.flash("success","New Review Created!");
  // res.send("new review saved");
  res.redirect(`/listings/${listing._id}`);
}))

//Delete review route
router.delete("/:reviewID", wrapAsync(async (req, res) => {
  let { id, reviewID } = req.params;
  // remove review reference from listing
  await Listing.findByIdAndUpdate(id, { $pull: { review: reviewID } });//pull and delete the review id in the listing document
  // delete review itself
  await Review.findByIdAndDelete(reviewID);
  req.flash("success","Review Deleted");
  res.redirect(`/listings/${id}`);
}));
module.exports=router;
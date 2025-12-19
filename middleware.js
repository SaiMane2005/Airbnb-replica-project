const Listing = require("./models/listing.js")
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review = require("./models/review.js")


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl;//redirectUrl is parameter made by me
      req.flash("error","You must be logged in to create listing");
    return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{//because when passport authonticate the user it reset the req.session.redirectUrl so we save the value to locals
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}
module.exports.isOwner=async(req,res,next)=>{//because when passport authonticate the user it reset the req.session.redirectUrl so we save the value to locals
  let{id}=req.params;
  let listing=await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
module.exports.validateListing=async(req,res,next)=>{//because when passport authonticate the user it reset the req.session.redirectUrl so we save the value to locals
  let {error}= listingSchema.validate(req.body)
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",")
      throw new ExpressError(400,errMsg)
    }else{
      next();
    }
}
module.exports.validateReview =(req,res,next)=>{
   let {error}= reviewSchema.validate(req.body)
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",")
      throw new ExpressError(400,errMsg)
    }else{
      next()
    }
}
// module.exports.isReviewAuthor=async(req,res,next)=>{
//   let{id, reviewId}=req.params;
//   let review=await Review.findById(reviewId);
//   console.log(review.author);
//   if(!review.author.equals(res.locals.currUser._id)){
//     req.flash("error","You are not the author of this review");
//     return res.redirect(`/listings/${id}`);
//   }
//   next();
// }
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewID } = req.params;
  let review = await Review.findById(reviewID);

  if (!review || !review.author) {
    req.flash("error", "Review author not found");
    return res.redirect(`/listings/${id}`);
  }

  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

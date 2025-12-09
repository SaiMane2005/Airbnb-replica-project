const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema}=require("./schema.js");

const Review = require("./models/review.js");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
// app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => console.log("connected to the db"))
  .catch((err) => console.log(err));

app.listen(8080, () => {
  console.log("server is listening at port 8080");
});

app.get("/", (req, res) => {
  res.send("working the root directory");
});

const validateListing =(req,res,next)=>{
   let {error}= listingSchema.validate(req.body)
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",")
      throw new ExpressError(400,errMsg)
    }else{
      next()
    }
}
const validateReview =(req,res,next)=>{
   let {error}= reviewSchema.validate(req.body)
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",")
      throw new ExpressError(400,errMsg)
    }else{
      next()
    }
}
// Index route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
}));

// New route
app.get("/listings/new", (req, res) => {
  res.render("./listings/new.ejs");
});

// Show route
app.get("/listings/:id",wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/show.ejs", { listing });
}));

// Create route
app.post(
  "/listings",validateListing,
  wrapAsync(async (req, res, next) => {

    const newListing = new Listing(req.body.listing);

    await newListing.save();
    res.redirect("/listings");
  })
);
// Edit route
app.get("/listings/:id/edit",wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/edit.ejs", { listing });
}));

// Update route
app.put("/listings/:id",validateListing, wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

// Delete route
app.delete("/listings/:id",wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));
//Review route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
  let listing=await Listing.findById(req.params.id);
  let newReview=new Review(req.body.review);
  listing.review.push(newReview);

  await newReview.save();
  await listing.save();
  console.log("new review saved");
  res.send("new review saved");

}))
//error handling for the not existing pages
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});





// Error Handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
  // res.status(statusCode).render("./listings/error.ejs",{err});
});

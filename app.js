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
const listings=require("./routes/listing.js")
const reviews=require("./routes/review.js")
const session=require("express-session");
const flash=require("connect-flash")
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions={
  secret:"mysupersecretstring",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7 * 24 * 60 * 60* 1000,
    maxAge: 7 * 24 * 60 * 60* 1000,
    httpOnly: true
  }
}
app.get("/", (req, res) => {
  res.send("Hi,I am root");
});
app.use(session(sessionOptions));
app.use(flash())

app.use( (req,res,next)=>{
  res.locals.success=req.flash("success");
  next();

})

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

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews)

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

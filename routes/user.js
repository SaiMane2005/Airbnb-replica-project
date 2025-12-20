const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const Listing = require("../models/listing.js")
const {saveRedirectUrl}=require("../middleware")
const userController=require("../controller/users.js")

router.get("/signup",userController.renderSignUpForm)
router.post("/signup",wrapAsync(userController.signup))
router.get("/login",userController.renderLogInForm)
router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:"/login",failureFlash:true
    }),
    userController.login)
//log out
router.get("/logout",userController.logout)
module.exports=router;
const User=require("../models/user");
const passport = require("passport");

module.exports.renderSignUpForm=(req,res)=>{
    res.render("users/signup.ejs")

}
module.exports.signup=async(req,res)=>{
    try{
        let{username,password,email}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success","Welcome to wanderlust");
            res.redirect("/listings")

        })

    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");

    }
}
module.exports.renderLogInForm=(req,res)=>{
    res.render("./users/login.ejs");
}
module.exports.login=async(req,res)=>{//passport.authenticate is an middleware
       req.flash("success","Welcome backe to Wanderlust! ")
      res.redirect("/listings")
    // res.redirect(res.locals.redirectUrl);
}
module.exports.logout=(req,res,next)=>{
  req.logout((err)=>{
    if(err){
     return next(err);
    }
    req.flash("success","You are log out!")
    res.redirect("/listings")
  })
}
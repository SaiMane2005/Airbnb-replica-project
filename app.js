const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js")
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate")

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));//parsing the data
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);//used to create layouts
app.use(express.static(path.join(__dirname,"/public")))

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("connected to the db");
}).catch((err)=>{
    console.log(err);
})

app.listen(8080,()=>{
    console.log("server is listening at port 8080");
})
app.get("/",(req,res)=>{
    res.send("working the root directory");
});
//Index route
app.get("/listings",async(req,res)=>{
    const allListings =await Listing.find({})
    res.render("./listings/index.ejs",{allListings})

})
//new route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
})
//show route(printing the data of individule listing)
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
})
//create route
app.post("/listings",async(req,res)=>{
   const newListing= new Listing(req.body.listing);
   //req.body.listing gives just that inner object.
   //creates a new document using your Mongoose model called Listing.
   await newListing.save();
    res.redirect("/listings")
   console.log(listing);
})
//Edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});

})
//Update route
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`)
})
//Delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings")

})













// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new Villa",
//         discription:"By the beach",
//         price:1200,
//         location:"pune",
//         country:"India"

//     })
//     await sampleListing.save();
//     console.log("sample was saved")
//     res.send("successfull");

// })

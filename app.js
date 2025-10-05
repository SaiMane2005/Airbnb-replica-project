const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js")
const path=require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

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

app.get("/listings",async(req,res)=>{
    const allListings =await Listing.find({})
    res.render("./listings/index.ejs",{allListings})

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

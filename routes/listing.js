const express = require("express");
const router= express.Router();
const wrapasync=require("../utils/wrapasync.js");
const{listingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js"); 
const listing = require("../models/listing.js");

const validatelisting=(req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
     throw new ExpressError(400,errMsg
        
     );
    }
    else{
        next();
    }
};

router.get("/",wrapasync(async(req,res)=>{
    const alllisting= await  listing.find({});
    res.render("listings/index.ejs",{alllisting});
   }));
   
   router.get("/new",(req,res)=>{
       res.render("listings/new.ejs");
   })
   
   router.get("/:id",wrapasync(async(req,res)=>{
       let{id}=req.params;
        const listings= await listing.findById(id).populate("review");
        if(!listings){
            req.flash("error"," listing you  requested for does not exist");
            res.redirect("/listings");
        }
        res.render("listings/show.ejs",{listings});
   }));

 router.post("/",validatelisting,wrapasync(async(req,res,next)=>{
    const newlisting= new listing(req.body.listing);
        await newlisting.save();
        req.flash("success","new listing created");
        res.redirect("/listings");
    })
 );

router.get("/:id/edit",wrapasync(async(req,res)=>{
    let{id}=req.params;
    const listings= await listing.findById(id); 
    if(!listings){
        req.flash("error"," listing you  requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listings});
}));

router.put("/:id", validatelisting,wrapasync(async(req,res)=>{
    let{id}=req.params;
   await listing.findByIdAndUpdate(id,{...req.body.listing});
   req.flash("success"," listing updated");
   res.redirect(`/listings/${id}`);
}));

router.delete("/:id",wrapasync(async(req,res)=>{
    let{id}=req.params;
   let deleted =  await listing.findByIdAndDelete(id);
   console.log(deleted);
   req.flash("success","listing deleted");
   res.redirect("/listings");
}));

module.exports= router;

   

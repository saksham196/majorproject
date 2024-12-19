const express = require("express");
const router= express.Router({mergeParams:true});
const wrapasync=require("../utils/wrapasync.js");
const ExpressError=require("../utils/ExpressError.js"); 
const{reviewSchema}=require("../schema.js");
const Review= require("../models/review.js");
const listing = require("../models/listing.js");



const validateReview=(req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
    
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
     throw new ExpressError(400,errMsg
        
     );
    }
    else{
        next();
    }
}


router.post("/",validateReview,wrapasync(async(req,res)=>{
    
    let alisting=await listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
      alisting.review.push(newReview);
       await newReview.save();
       await alisting.save();
       req.flash("success","new review created");
      res.redirect(`/listings/${alisting._id}`);
    }));
    
    
    router.delete("/:reviewid",wrapasync(async(req,res)=>{
        let{id,reviewid}=req.params;
        await listing.findByIdAndUpdate(id,{$pull: {review:reviewid}});
        await Review.findByIdAndDelete(reviewid);
        req.flash("success"," review deleted");
       res.redirect(`/listings/${id}`);
    })
    );

    module.exports = router;
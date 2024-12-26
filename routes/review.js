const express = require("express");
const router= express.Router({mergeParams:true});
const wrapasync=require("../utils/wrapasync.js");
const ExpressError=require("../utils/ExpressError.js"); 
const{reviewSchema}=require("../schema.js");
const Review= require("../models/review.js");
const listing = require("../models/listing.js");
const {isLoggedIn,isreviewAuthor}= require("../middleware.js");
const reviewController=require("../controllers/reviews.js");    

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


router.post("/",isLoggedIn,validateReview,wrapasync(reviewController.createReview));
    
    
    router.delete("/:reviewid",isLoggedIn,isreviewAuthor,wrapasync(reviewController.deleteReview));

    module.exports = router;
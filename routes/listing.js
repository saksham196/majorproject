const express = require("express");
const router= express.Router();
const wrapasync=require("../utils/wrapasync.js");
const{listingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js"); 
const listing = require("../models/listing.js");
const{isLoggedIn,isOwner}  = require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer=require('multer');
const{storage}=require("../cloudconfig.js");
const upload=multer({ storage});

const validatelisting=(req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
     throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};
router.route("/")
.get(wrapasync(listingController.index))
.post(isLoggedIn, upload.single('listing[image]'),validatelisting,wrapasync(listingController.createListing));



   
 router.get("/new",isLoggedIn,listingController.renderNewForm);
   
   router.get("/:id",wrapasync(listingController.showListing));

 

router.get("/:id/edit",isLoggedIn,isOwner,wrapasync(listingController.renderEditForm));


router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'),validatelisting,wrapasync(listingController.updateListing));


router.delete("/:id",isLoggedIn,isOwner,wrapasync(listingController.deleteListing));

module.exports= router;

   

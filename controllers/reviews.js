const listing=require("../models/listing.js");
const Review=require("../models/review.js");
module.exports .createReview=async(req,res)=>{
    
 let alisting=await listing.findById(req.params.id);
let newReview= new Review(req.body.review);
 newReview.author=req.user._id;
  alisting.review.push(newReview);
       await newReview.save();
       await alisting.save();
       req.flash("success","new review created");
      res.redirect(`/listings/${alisting._id}`);
    }

 module.exports.deleteReview=async(req,res)=>{
         let{id,reviewid}=req.params;
         await listing.findByIdAndUpdate(id,{$pull: {review:reviewid}});
         await Review.findByIdAndDelete(reviewid);
         req.flash("success"," review deleted");
        res.redirect(`/listings/${id}`);
     }  
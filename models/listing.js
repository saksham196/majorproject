const mongoose=require("mongoose");

const Schema = mongoose.Schema;
const Review=require("./review.js");

const listingSchema = new Schema({

    title : {
      type:  String,
      required: true,
    },
    description : String,
    image:{
        type:String,
      
       default: "https://unsplash.com/photos/the-sun-is-setting-over-a-beach-with-mountains-in-the-background-rPFwyWaie7w",
        
        set:(v)=> v===""?"https://unsplash.com/photos/the-sun-is-setting-over-a-beach-with-mountains-in-the-background-rPFwyWaie7w"
         : v,

    },   
    price:Number,
    location:String,
    country:String,
    review:[
      {
        type:Schema.Types.ObjectId,
        ref:"Review",
      },
    ],
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
   await Review.deleteMany({_id:{$in:listing.review}});
  }
});

const listing =mongoose.model("listing",listingSchema);
module.exports =listing;
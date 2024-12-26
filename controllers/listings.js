const listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async(req,res)=>{
    const alllisting= await  listing.find({});
    res.render("listings/index.ejs",{alllisting});
   }

 module.exports.renderNewForm=(req,res) => {
    res.render("listings/new.ejs");
 };  

 module.exports.showListing=async(req,res)=>{
    let{id}=req.params;
     const listings= await listing.findById(id).populate({
         path:"review",
         populate:{
             path:"author",
         },
     }).populate("owner");
     if(!listings){
         req.flash("error"," listing you  requested for does not exist");
         res.redirect("/listings");
     }
     res.render("listings/show.ejs",{listings});
}

module.exports.createListing=async(req,res,next)=>{
  let response= await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();
       
       

    let url=req.file.path;
    let filename=req.file.filename;
    const newlisting= new listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    newlisting.geometry= response.body.features[0].geometry;
       let savedlisting= await newlisting.save();
       console.log(savedlisting);
        req.flash("success","new listing created");
        res.redirect("/listings");
}

module.exports.renderEditForm=async(req,res)=>{
    let{id}=req.params;
    const listings= await listing.findById(id); 
    if(!listings){
        req.flash("error"," listing you  requested for does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl=listings.image.url;
    originalImageUrl.replace("/upload","/upload/w_250,h_300");
    res.render("listings/edit.ejs",{listings,originalImageUrl});
};

module.exports.updateListing=async(req,res)=>{
    let{id}=req.params;
   let alistings = await listing.findByIdAndUpdate(id,{...req.body.listing});
   if( typeof req.file !="undefined"){
   let url=req.file.path;
    let filename=req.file.filename;
   alistings.image={url,filename};
   await alistings.save();
   }
   req.flash("success"," listing updated");
   res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async(req,res)=>{
    let{id}=req.params;
   let deleted =  await listing.findByIdAndDelete(id);
   console.log(deleted);
   req.flash("success","listing deleted");
   res.redirect("/listings");
};
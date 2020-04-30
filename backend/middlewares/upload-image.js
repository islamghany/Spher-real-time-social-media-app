const cloudinaryStorage = require("multer-storage-cloudinary");
const multer = require('multer');
const cloudinary = require("cloudinary");
require("dotenv").config();

cloudinary.config({
cloud_name:'dmygcaifb',
api_key: `${process.env.API_KEY}`,
api_secret: `${process.env.API_SECRET}`
});

const cloudStorage = cloudinaryStorage({
cloudinary: cloudinary,
folder: (req,file,cb)=>{
	const dir = req.body.creator ? "posts" : "profile pictures";
	cb(null,dir)
},
allowedFormats: ["jpg","png","jpeg","pdf","svg"],
transformation:(req,file,cb)=>{
  if(file.resource_type==="row")cb(null,null)
  else {	
  const tans = !req.body.width ? [{width:600, gravity: "faces", crop: "fill"}] : [{x: parseInt(req.body.x), y: parseInt(req.body.y), width: parseInt(req.body.width),  crop: "crop"}];
  cb(null,tans); 
    } 
 }
});
  
module.exports=multer({storage: cloudStorage});
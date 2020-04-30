const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const postSchema = new Schema({
	title:{
		type:String,
	},
	img:{
		type: String
	},
	location:{
		type:String
	},
	publicId:{
		type:String
	},
	comments:[{type:mongoose.Types.ObjectId,ref:'Comment'}],
	liked:[{type: mongoose.Types.ObjectId}],
	creator:{ type: mongoose.Types.ObjectId, required: true, ref:'User' },
},{
	timestamps: true
});

module.exports=mongoose.model('Post',postSchema);
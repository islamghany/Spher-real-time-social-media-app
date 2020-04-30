const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema =Schema({
	content:{
		type:String,
		required:true,
	},
	 user:{
	 	type:mongoose.Types.ObjectId,
	 	ref:'User'
	 }
},{
	timestamps: true
})

module.exports = mongoose.model('Comment',commentSchema);
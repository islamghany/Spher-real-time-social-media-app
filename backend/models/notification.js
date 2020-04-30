const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notificationSchema = Schema({
	receiver:{
		type:mongoose.Types.ObjectId,
		ref:'User',
		required:true
	},
	text:{
		type:String,
		required:true
	},
	to:{
		type:mongoose.Types.ObjectId
	},
	senderImg:{
		type:String
	}
},{
	timestamps: true
});

module.exports = mongoose.model('Notification' , notificationSchema);
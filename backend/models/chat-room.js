const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatRoomSchema =  Schema({
	name:{
		type:String,
		default:'Untitled'
	},
	chatIcon:{
		type:String,
		default:'https://res.cloudinary.com/dmygcaifb/image/upload/v1586082543/avatars/gorilla_zc1zxj.jpg'
	},
	members:[{ type: mongoose.Types.ObjectId, required: true, ref: 'User' }],
	latestMessageDate: {
      type: Date,
      default: Date.now,
    },
},{
	timestamps:true
})
module.exports = mongoose.model('ChatRoom',chatRoomSchema);
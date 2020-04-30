const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userEndDateSchema =  Schema (
  {
    data: {
      type: Boolean,
      default: false,
    },
    endDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id : false,
  },
);
const userChatRoomSchema = Schema (
  {
    data: {
      type: mongoose.Types.ObjectId,
      ref: 'ChatRoom',
    },
    unReadMessages: {
      type: Number,
      default: 0,
    },
    lastMessage:{
    	type:String
    },
    mute: userEndDateSchema,
  },
  {
    _id : false,
  },
);
const userSchema = Schema({
	name:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true,
		unique:true,
	},
	chatRooms: [userChatRoomSchema],
	password:{
		type:String,
		required:true,
		minlength:6
	},
	username:{
		type:String,
		required:true,
		unique:true
	},
	cover:{
		type:String
	},
	 isOnline: {
      type: Boolean,
      default: false,
    },
    socketId: {
      type: String,
      default: '',
    },
	img:{
		
	},
	publicId:{
		type:String
	},
	about:{
		livesIn:{
			type:String
		},
		bio:{
			type:String,
			maxLength:255
		},
		birth:{
			type:String
		},
		gender:{
			type:String
		},
		from:{
			type:String
		}
	},
	posts:[{ type: mongoose.Types.ObjectId, required: true, ref: 'Post' }],
	notifications:[{type:mongoose.Types.ObjectId,ref:'Notification'}],
	unReadNotifications:{
		type:Number,
		default:0
	}
},{
	timestamps: true
})


userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User',userSchema)
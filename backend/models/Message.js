const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema =  Schema({
	text:String,
	user:{type:mongoose.Types.ObjectId,required:true,ref:'User'},
	chatRoom:{type:mongoose.Types.ObjectId,required:true,ref:'ChatRoom'},
	 messageType: {
      type: String,
      enum: [
        'text',
        'file',
        'image',
        'audio',
      ],
      default: 'text',
    },
    fileLink: {
      type: String,
      default: '',
    }
},{
	timestamps:true
});

module.exports = mongoose.model('Message',MessageSchema);
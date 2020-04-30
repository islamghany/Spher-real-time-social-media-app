const Message = require('../models/Message.js');
const User = require('../models/user.js');
const ChatRoom = require('../models/chat-room.js');
const HttpError = require("../models/HttpError");

const getMessages = async (req,res,next)=>{
  const {userId,roomId,skip,newLoad} = req.body;
    let messages;
    let roomInfo;
    try{
       messages = await Message.find({chatRoom:roomId}).sort({createdAt: 'descending'}).skip(parseInt(skip)).limit(20).populate('user', '-chatRooms -about -posts -password -email -img -name -socketId')
       if(newLoad==='load') roomInfo = await ChatRoom.findById(roomId).select('chatIcon name _id');
        
    }catch(err){
        const error = new HttpError("Something went wrong", 500);
       return next(error);
    }
    messages.reverse();

    try{
      await User.updateOne({_id:userId,'chatRooms.data': roomId},
            { $inc: { 'chatRooms.$.unReadMessages': 0 } },
              { safe: true, upsert: true, new: true })
    }catch(err){
    const error = new HttpError("Something went wrong", 500);
       return next(error);
    }
    res.json({
      messages,
      roomInfo
    })
    
}

const sendMessage = async (req,res,next)=>{
  const {userId,roomId,text} = req.body;
  let sendMessage;
     if(!req.file){

      sentMessage = new Message({
        user:userId,
        chatRoom:roomId,
        text,
        messageType:'text'
      });
   }
   else{
     const format = req.file.format === "pdf" ? "file" : "image"  
     sentMessage = new Message({
          user:userId,
          chatRoom:roomId,
          messageType:format,
          fileLink:req.file.url,
          text:req.file.originalname
        });
   }
    try{
       await sentMessage.save();
    }catch(err){
       const error = new HttpError("Something went wrong", 500);
       return next(error);
    }
    let chatRoom;
     try{
      chatRoom = await ChatRoom.findByIdAndUpdate(roomId,
        {$set:{latestMessageDate: sentMessage.createdAt }},
         { safe: true, upsert: true, new: true });
    }catch(err){
       const error = new HttpError("Something went wrong", 500);
       return next(error);
    }
     try{
       for(let i =0 ;i<chatRoom.members.length;i++){
        const memberId = chatRoom.members[i];
        if(memberId != userId){
          await User.updateOne({_id:memberId,'chatRooms.data': roomId},
            { $inc: { 'chatRooms.$.unReadMessages': 1 } },
              { safe: true, upsert: true, new: true })
        }
       }
    }catch(err){
       const error = new HttpError("Something went wrong", 500);
       return next(error);
    }
    res.json({
      message:sentMessage
    })

}

module.exports={
  sendMessage,
  getMessages,
}
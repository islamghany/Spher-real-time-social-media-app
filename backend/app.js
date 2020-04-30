const express = require('express');
const bodyParser = require('body-parser');
const HttpError=require('./models/HttpError');
const mongoose=require('mongoose');
const postsRoutes = require('./routes/posts-routes');
const usersRoutes = require('./routes/users-routes');
const chatRoomRoutes = require('./routes/chat-room');
const messagesRoutes = require('./routes/messages-routes');

const User = require('./models/user');
const ChatRoom = require('./models/chat-room');

require('dotenv/config')
const app= express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use('/api/posts',postsRoutes);
app.use('/api/users',usersRoutes);
app.use('/api/chat',chatRoomRoutes);
app.use('/api/messages',messagesRoutes);

// handle errors : 404;
app.use((req,res,next)=>{
	const error = new  HttpError('Could not find this route.', 404);
    throw error; 
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mern-7ywg4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`).then(()=>{
	const server = app.listen(process.env.PORT || 5000);
  const sock = require('./socket');
  const io = sock.init(server);
  const connectedUsers = {};
  io.on('connection',  (socket) =>{
      
      socket.on('action',async (action)=>{
        switch(action.type){
        case 'USER_LOGIN':{
          const user = await User.findByIdAndUpdate(
            action.userId,
            { $set: { isOnline: true, socketId: socket.id } },
            { safe: true, upsert: true, new: true,select: '_id'  },
          );
         connectedUsers[socket.id]=user._id;
          break;
        }
          case 'JOIN_CHAT_ROOM': {
          socket.join(action.roomId);
          break;
        }
        case 'LEAVE_CHAT_ROOM': {
          socket.leave(action.roomId);
          break;
        }
        case 'SEND_NOTFY':{
           const id= action.notify.receiver;
           const user = await User.findById(id).select('isOnline socketId');
           if(user.isOnline){
                 socket.broadcast.to(user.socketId).emit('action', {
                            type: 'ClIENT_SEND_NOTFY',
                            notify: action.notify,
                            state:action.state,
                 });
           }
           break;
        }
        case 'SEND_MESSAGE':{ 
            let roomClients;
            io.in(action.roomId).clients((err, clients) => {
            
            if (!err) {
              roomClients = clients;
            }
          });
          
            try{
               const room = await ChatRoom.findById(action.roomId).populate('members');
               for(let i =0;i<room.members.length;i++){
                  const memberId = room.members[i];
                  const user = await User.findById(memberId,'-password -about -posts ').populate({path:'chatRooms.data',select:'-members'});
                  if(roomClients.indexOf(user.socketId) > -1){
                    let lastMessage= memberId === action.userId ? "You" : action.username ;
                    lastMessage+=" : "
                    if(action.message.messageType==='text'){
                         lastMessage+=action.message.text
                    }
                    else if(action.message.messageType==='image'){
                         lastMessage+="sent a photo"
                    }
                    else if(action.message.messageType==='file'){
                         lastMessage+="sent an attachment"
                    }
                    await User.updateOne({ _id: user._id, 'chatRooms.data': action.roomId },
                            { $set: { 'chatRooms.$.unReadMessages': 0 , 'chatRooms.$.lastMessage':lastMessage } },
                            { safe: true, upsert: true, new: true })
                      socket.broadcast.to(user.socketId).emit('action', {
                            type: 'ClIENT_SEND_MESSAGE',
                            message: action.message
                          });
                  }
                  if(user.isOnline){
                        io.to(user.socketId).emit('action', {
                            type: 'RENDER_ROOMS'
                          });
                        }
               }
            }catch(err){
              console.log(err);
            }

            break;
        }
        case 'CREATE_CAHT_ROOM':{
          const mem = action.members.map(member=>member.value)       
          for(let i=0;i<mem.length;i++){
            try{
              const user = await User.findById(mem[i]).select('socketId');
              socket.broadcast.to(user.socketId).emit('action',{
                  type:'CREATE_CAHT_ROOM',
                  chatRoom:action.data
              })  
            }catch(err){
              console.log(err);
            }
          }
        }
        break;
        }
      })

      socket.on('disconnect', async ()=>{
        await User.findByIdAndUpdate(
            connectedUsers[socket.id],
            { $set: { isOnline: false, socketId: '' } },
            { safe: true, upsert: true, new: true,select: '_id'  },
          );
      } )
      
  })
}).catch(err=>{
	console.log(err);
})

const HttpError = require("./models/HttpError");

let io;
let socket; 
module.exports = {
	init:httpServer =>{
		io = require('socket.io')(httpServer);
		 return io;
	},
	getIO:()=>{
		 if (!io) {
      throw new HttpError('Socket.io not initialized!',500);
    }
    return io;
	},
   
}
const User = require("../models/user.js");
const ChatRoom = require("../models/chat-room.js");
const HttpError = require("../models/HttpError");

const createRoom = async (req, res, next) => {
  const { name, members } = req.body;
  const mem = members.map((member) => member.value);
  let chatRoomData;
  const coversImages = [
    "https://res.cloudinary.com/dmygcaifb/image/upload/v1585949642/covers/cover-image-2.png",
    "https://res.cloudinary.com/dmygcaifb/image/upload/v1585949949/covers/cover-image-3_x70ka6.png",
    "https://res.cloudinary.com/dmygcaifb/image/upload/v1585949415/covers/cover-image-1.png",
    "https://res.cloudinary.com/dmygcaifb/image/upload/v1585951096/covers/shot_2x_rjrzuk.jpg",
    "https://res.cloudinary.com/dmygcaifb/image/upload/v1586083005/covers/galshir-astronaut_2x_lu7vke.png",
    "https://res.cloudinary.com/dmygcaifb/image/upload/v1585951116/covers/15ca317faac1451c71d17229a9097c94_byyeza.png",
  ];
  const RandomNo = Math.floor(Math.random() * 6);
  const createdRoom = new ChatRoom({
    name,
    members: mem,
    chatIcon: coversImages[RandomNo],
  });
  try {
    await createdRoom.save();
    for (let i = 0; i < mem.length; i += 1) {
      const chatRoomMember = mem[i];
      await User.findByIdAndUpdate(
        chatRoomMember,
        { $push: { chatRooms: { data: createdRoom._id, mute: {} } } },
        { safe: true, upsert: true, new: true }
      );
    }
    chatRoomData = await ChatRoom.findById(createdRoom._id).populate(
      "members",
      "-chatRooms  -socketID -about -password -posts"
    );
  } catch (err) {
    const error = new HttpError("Could not find user for provided id....", 404);
    return next(error);
  }
  res.json({
    chatRoom: {
      data: chatRoomData,
      unReadMessages: 0,
      mute: {
        data: false,
      },
    },
  });
};
const chatRoomInfo = async (req, res, next) => {
  const id = req.params.id;
  let chatRoomData;
  try {
    chatRoomData = await ChatRoom.findById(id).populate(
      "members",
      "-chatRooms  -socketID -about -password -posts"
    );
  } catch (err) {
    const error = new HttpError("Could not find user for provided id....", 404);
    return next(error);
  }
  res.json({
    chatRoomData,
  });
};
module.exports = {
  createRoom,
  chatRoomInfo,
};

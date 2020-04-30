const { validationResult } = require("express-validator");
const HttpError = require("../models/HttpError");
const User = require("../models/user");
const ChatRoom = require("../models/chat-room");
const Post = require("../models/post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
require("dotenv").config();

cloudinary.config({
cloud_name:'dmygcaifb',
api_key: `${process.env.API_KEY}`,
api_secret: `${process.env.API_SECRET}`
});

const getUser = async (req, res, next) => {
  let uid = req.params.id;
  if (req.query.skip === undefined) {
    let user;
    try {
      user = await User.findById(uid, "-password");
    } catch (err) {
      const error = new HttpError(
        "An error occur,please try again later.",
        500
      );
      return next(error);
    }
    if (!user) {
      const error = new HttpError(
        "An error occur,please try again later.",
        500
      );
      return next(error);
    }
    res.json({ user });
  } else {
    let x = parseInt(req.query.skip);

    let user;
    try {
      user = await User.findById(uid)
        .select("posts")
        .populate({
          path: "posts",
          options: {
            limit: 10,
            skip: x,
            sort: { createdAt: -1 },
          },
        });
    } catch (err) {
      const error = new HttpError(
        "An error occur,please try again later.",
        500
      );
      return next(error);
    }
    if (!user) {
      const error = new HttpError(
        "An error occur,please try again later.",
        500
      );
      return next(error);
    }
    res.json({ posts: user.posts });
  }
};
const userRooms = async (req, res, next) => {
  const { id } = req.params;
  let rooms;
  try {
    rooms = await User.findById(id)
      .select("chatRooms socketId")
      .populate({
        path: "chatRooms.data",
        populate: {
          path: "members",
          select: "-chatRooms -socketID",
        },
      });
  } catch (err) {
    const error = new HttpError("something went wrong", 500);
    return next(error);
  }
  rooms = rooms.chatRooms.sort(
    (roomA, roomB) => roomB.data.updatedAt - roomA.data.updatedAt
  );
  res.json({ rooms });
};
const changeImg = async (req, res, next) => {

  if (!req.file) {
    const error = new HttpError("someting went wrong", 401);
    return next(error);
  }
  let user,
    uid = req.params.id;
  try {
    user = await User.findById(uid, "-password");
  } catch (err) {
    const error = new HttpError("An error occur,please try again later.", 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError("An error occur,please try again later..", 500);
    return next(error);
  }
  if (user.publicId) {
    cloudinary.v2.uploader.destroy(`${user.publicId}`, function (err, result) {
      if (err) {
        const error = new HttpError(
          "An error occur,please try again later..",
          500
        );
        return next(error);
      }
    });
  }
  try {
    user.img = req.file.url;
    user.publicId = req.file.public_id;
    await user.save();
  } catch (err) {
    const error = new HttpError("someting went wrong", 401);
    return next(error);
  }
  res.json({ img: req.file.url });
};

const getUserNotifications = async (req, res, next) => {
  const { id } = req.params;
  const { skip } = req.query;
  let user;
  try {
    user = await User.findById(id)
      .select("notifications unReadNotifications")
      .populate({
        path: "notifications",
        options: {
          sort: {
            createdAt: -1,
          },
          limit: 10,
          skip: parseInt(skip),
        },
      });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError("can not find user with this id", 404);
    return next(error);
  }
  res.json({
    notifications: user.notifications,
    unReadNotifications: user.unReadNotifications,
  });
};
const clearUnReadNotifications = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { unReadNotifications: 0 });
  } catch (err) {
    const error = new HttpError("can not find user with this id", 404);
    return next(error);
  }
  res.json({
    message: "cleared",
  });
};
const getUsers = async (req, res, next) => {
  const { q, skip, limit ,id} = req.query;
  let users, length;

  if (limit) {
    try {
      users = await User.find({ username: { $regex: q }, _id:{$ne:id} })
        .select("username _id")
        .limit(7);
    } catch (err) {
      const error = new HttpError(
        "Fetching users failed, please try again later.",
        500
      );
      return next(error);
    }

    res.json({
      users: users.map((user) => {
        return {
          label: user.username,
          value: user._id,
        };
      }),
    });
  } else {
    try {
      length = await User.find(
        { username: { $regex: q } },
        "-password"
      ).countDocuments();
      users = await User.find({ username: { $regex: q } }, "-password")
        .skip(parseInt(skip))
        .limit(5);
    } catch (err) {
      const error = new HttpError(
        "Fetching users failed, please try again later.",
        500
      );
      return next(error);
    }
    res.json({ users, length });
  }
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password, username } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({$or: [{ email: email} , {username:username}]});
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Could not signup, please try again.", 500);
    return next(err);
  }
  const profileImages = [
    "https://res.cloudinary.com/dmygcaifb/image/upload/v1586082544/avatars/animals-06_x6wtpp.jpg",
    "https://res.cloudinary.com/dmygcaifb/image/upload/v1586082544/avatars/animals-02_y9hhez.jpg",
    "https://res.cloudinary.com/dmygcaifb/image/upload/v1586082544/avatars/tiger_bd3600.jpg",
    "https://res.cloudinary.com/dmygcaifb/image/upload/v1586082544/avatars/animals-05_err6w0.jpg",
    "https://res.cloudinary.com/dmygcaifb/image/upload/v1586082544/avatars/lion_eofujq.jpg",
    "https://res.cloudinary.com/dmygcaifb/image/upload/v1586082543/avatars/gorilla_zc1zxj.jpg",
  ];
  const coversImages = [
    "https://res.cloudinary.com/dmygcaifb/image/upload/v1585949642/covers/cover-image-2.png",
    "https://res.cloudinary.com/dmygcaifb/image/upload/v1585949949/covers/cover-image-3_x70ka6.png",
    "https://res.cloudinary.com/dmygcaifb/image/upload/v1585949415/covers/cover-image-1.png",
    "https://res.cloudinary.com/dmygcaifb/image/upload/v1585951096/covers/shot_2x_rjrzuk.jpg",
    "https://res.cloudinary.com/dmygcaifb/image/upload/v1586083005/covers/galshir-astronaut_2x_lu7vke.png",
    "https://res.cloudinary.com/dmygcaifb/image/upload/v1585951116/covers/15ca317faac1451c71d17229a9097c94_byyeza.png",
  ];
  const RandomNo = Math.floor(Math.random() * 6);
  const createdUser = new User({
    name,
    email,
    username,
    img: profileImages[RandomNo],
    password: hashedPassword,
    posts: [],
    cover: coversImages[RandomNo],
    publicId: null,
  });
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        _id: createdUser.id,
        email: createdUser.email,
        username: createdUser.username,
      },
      "very-secret-password",
      { expiresIn: "30d" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
  res.status(201).json({
    token: token,
    ...createdUser._doc,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Loggin in failed, please try again later.",
      500
    );
    return next(error);
  }
  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }
  let validPassword;
  try {
    validPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError("Could not login, please try again.", 500);
    return next(err);
  }
  if (!validPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      {
        _id: existingUser.id,
        email: existingUser.email,
        username: existingUser.username,
      },
      "very-secret-password",
      { expiresIn: "30d" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    token: token,
    ...existingUser._doc,
  });
};

const changePassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { newPassword, oldPassword, confirmPassword } = req.body,
    id = req.params.id;

  if (newPassword !== confirmPassword) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  let validPassword, newHashedPassword, user;
  try {
    user = await User.findById(id);
  } catch (err) {
    return next(
      new HttpError("someting went wrong, please try again later.", 500)
    );
  }

  if (!user) {
    return next(
      new HttpError("this user is not exists, please try to sign in first", 422)
    );
  }
  try {
    validPassword = await bcrypt.compare(oldPassword, user.password);
    newHashedPassword = await bcrypt.hash(newPassword, 12);
  } catch (err) {
    return next(
      new HttpError("someting went wrong, please try again later.", 500)
    );
  }
  if (!validPassword) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  try {
    user.password = newHashedPassword;
  } catch (err) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  res.json({
    message: "success",
  });
};
const updateInfo = async (req, res, next) => {
  const { socketId, bio, birth, from, livesIn, gender, name } = req.body;
  const id = req.params.id;
  let user;
  try {
    user = await User.findById(id, "-password");
  } catch (err) {
    return next(
      new HttpError("someting went wrong, please try again later.", 500)
    );
  }
  try {
    if (bio) user.about.bio = bio;
    if (birth) user.about.birth = birth;
    if (from) user.about.from = from;
    if (livesIn) user.about.livesIn = livesIn;
    if (gender) user.about.gender = gender;
    if (name) user.name = name;
    if (socketId) user.socketId = socketId;
    await user.save();
  } catch (err) {
    return next(
      new HttpError("someting went wrong, please try again later.", 500)
    );
  }
  res.json({
    ...user._doc,
  });
};

module.exports = {
  userRooms,
  getUsers,
  signup,
  login,
  getUser,
  changeImg,
  changePassword,
  updateInfo,
  getUserNotifications,
  clearUnReadNotifications,
};

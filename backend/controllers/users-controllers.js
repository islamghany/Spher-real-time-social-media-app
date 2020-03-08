const { validationResult } = require("express-validator");

const HttpError = require("../models/HttpError");
const User = require("../models/user");
const Post = require("../models/post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var Jimp = require("jimp");

const getUser = async (req, res, next) => {
  let user,
    uid = req.params.id;
  try {
    user = await User.findById(uid, "-password");
  } catch (err) {
    const error = new HttpError("An error occur,please try again later.", 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError("An error occur,please try again later.", 500);
    return next(error);
  }
  res.json({ user });
};
const changeImg = async (req, res, next) => {
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
  let img = null;
  let BufferImg = null;
  if (req.file && req.file.buffer) {
    try {
      img = await Jimp.read(req.file.buffer);
      await img.resize(250, 250);
    } catch (err) {
      const error = new HttpError(
        "An error occur,please try again later...",
        500
      );
      return next(error);
    }
    img.getBuffer("image/png", (err, Buff) => {
      BufferImg = Buff;
    });
  } else {
    const error = new HttpError(
      "An error occur,please try again later...",
      500
    );
    return next(error);
  }
  try {
    user.img = BufferImg;
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "An error occur,please try again later....",
      500
    );
    return next(error);
  }
  res.json({ user });
};
const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
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
    existingUser = await User.findOne({ email: email });
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
  const createdUser = new User({
    name,
    email,
    username,
    img:
      "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_960_720.png",
    password: hashedPassword,
    posts: []
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
        username: createdUser.username
      },
      "very-secret-password",
      { expiresIn: "1d" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
  res.status(201).json({
    _id: createdUser.id,
    username: createdUser.username,
    email: createdUser.email,
    token: token,
    img:
      "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_960_720.png"
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
        username: existingUser.username
      },
      "very-secret-password",
      { expiresIn: "1d" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    _id: existingUser.id,
    username: existingUser.username,
    email: existingUser.email,
    token: token,
    img: existingUser.img
  });
};

module.exports = {
  getUsers,
  signup,
  login,
  getUser,
  changeImg
};

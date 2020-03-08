const mongoose = require("mongoose");
const HttpError = require("../models/HttpError");
const Post = require("../models/post");
const User = require("../models/user");
const multer = require("multer");
var Jimp = require("jimp");

const { validationResult } = require("express-validator");

const createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data..", 422)
    );
  }

  const { title, location, creator } = req.body;
  if (!title && !req.file) {
    return next(
      new HttpError("At least you should select post an image or a title!", 422)
    );
  }
  let img = null;
  let BufferImg = null;
  if (req.file && req.file.buffer) {
    try {
      img = await Jimp.read(req.file.buffer);
      await img.resize(614, Jimp.AUTO);
    } catch (err) {
      const error = new HttpError(
        "Creating post failed, please try again..",
        500
      );
      return next(error);
    }
    img.getBuffer("image/png", (err, Buff) => {
      BufferImg = Buff;
    });
  }

  const createdPost = new Post({
    title,
    img: BufferImg,
    creator,
    location,
    liked: []
  });
  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Creating post failed, please try again..",
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError("Could not find user for provided id....", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();

    sess.startTransaction();
    await createdPost.save();
    user.posts.push(createdPost);
    await user.save();
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creating post failed, please try again.", 500);
    return next(error);
  }
  res.status(201).json({ post: createdPost });
};
const likePost = async (req, res, next) => {
  const { creator, postId } = req.body;
  let post;
  try {
    post = await Post.findById(postId);
  } catch (err) {
    const error = new HttpError("someting went wrong.", 500);
    return next(error);
  }
  if (!post) {
    const error = new HttpError("someting went wrong.!", 500);
    return next(error);
  }

  const idx = post.liked.indexOf(creator);
  if (idx !== -1) {
    try {
      post.liked.splice(idx, 1);
      await post.save();
    } catch (err) {
      const error = new HttpError("someting went wrong.", 500);
      return next(error);
    }
  } else {
    try {
      post.liked.push(creator);
      await post.save();
    } catch (err) {
      const error = new HttpError("someting went wrong.", 500);
      return next(error);
    }
  }
  res.status(200).json({ message: "like" });
};
const getPosts = async (req, res, next) => {
  let posts;
  try {
    posts = await Post.find().populate({
      path: "creator"
    });
  } catch (err) {
    const error = new HttpError("something went wrong", 500);
    return next(error);
  }
  res.json({
    posts: posts.map(post => post.toObject({ getters: true })).reverse()
  });
};
const getPost = async (req, res, next) => {
  const postId = req.params.id;
  let post;
  try {
    post = await Post.findById(postId);
  } catch (err) {
    const error = new HttpError("something went wrong", 500);
    return next(error);
  }
  if (!post) {
    const error = new HttpError(
      "could not find the post with the given id",
      404
    );
    return next(error);
  }
  res.json({ post: post.toObject({ getters: true }) });
};
const editPost = async (req, res, next) => {
  const postId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data..", 422)
    );
  }
  let post;
  try {
    post = await Post.findById(postId);
  } catch (err) {
    const error = new HttpError("Something went wrong.!", 500);
    return next(error);
  }
  if (!post) {
    const error = new HttpError("Something went wrong.!", 400);
    return next(error);
  }
  try {
    post.title = req.body.title;
    await post.save();
  } catch (err) {
    const error = new HttpError("Something went wrong.!", 500);
    return next(error);
  }
  res.json({ message: "updated sucessfuly.!" });
};
const deletePost = async (req, res, next) => {
  const postId = req.params.id;
  let post;
  try {
    post = await Post.findById(postId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete post.",
      500
    );
    return next(error);
  }

  if (!post) {
    const error = new HttpError("could not find a post with a givern id ", 404);
    return next(error);
  }
  if (post.creator.id !== req.userData._id) {
    const error = new HttpError(
      "You are not allowed to delete this post.",
      401
    );
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();

    sess.startTransaction();

    await post.remove({ session: sess });

    post.creator.posts.pull(post);

    await post.creator.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted post." });
};

module.exports = {
  createPost: createPost,
  getPosts: getPosts,
  deletePost: deletePost,
  getPost: getPost,
  likePost: likePost,
  editPost
};

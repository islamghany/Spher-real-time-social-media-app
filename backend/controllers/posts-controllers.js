const mongoose = require("mongoose");
const HttpError = require("../models/HttpError");
const Post = require("../models/post");
const Comment = require("../models/Comment");
const User = require("../models/user");
const cloudinary = require("cloudinary");
const { validationResult } = require("express-validator");
const Notification = require("../models/notification");
require("dotenv").config();

cloudinary.config({
cloud_name:'dmygcaifb',
api_key: `${process.env.API_KEY}`,
api_secret: `${process.env.API_SECRET}`
});

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
  let url = null,
    pID = null;
  if (req.file) {
    url = req.file.url;
    pId = req.file.public_id;
  }
  const createdPost = new Post({
    title,
    img: url,
    publicId: pID,
    creator,
    location,
    liked: [],
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
  const { creator, postId, username, img } = req.body;
  let post, user;
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
  try {
    user = await User.findById(post.creator).select(
      "username img notifications"
    );
  } catch (err) {
    const error = new HttpError("someting went wrong.", 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError("someting went wrong.!", 500);
    return next(error);
  }
  let notify = null;
  let state = "REMOVE";
  const idx = post.liked.indexOf(creator);
  if (idx !== -1) {
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      post.liked.splice(idx, 1);
      if (creator != post.creator) {
        notify = await Notification.findOne({ to: postId });
        if (user.unReadNotifications) {
          const l = user.unReadNotifications;
          user.unReadNotifications = parseInt(l) - 1;
        } else user.unReadNotifications = 0;
        notify.remove({ session: sess });
        user.notifications.pull(notify);
        await user.save({ session: sess });
      }
      await post.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      const error = new HttpError("someting went wrong.", 500);
      return next(error);
    }
  } else {
    try {
      state = "ADD";
      post.liked.push(creator);
      await post.save();
      if (creator != post.creator) {
        notify = new Notification({
          receiver: post.creator,
          text: `${username} liked your post`,
          senderImg: img,
          to: postId,
        });
        if (user.unReadNotifications) {
          const l = user.unReadNotifications;
          user.unReadNotifications = parseInt(l) + 1;
        } else user.unReadNotifications = 1;
        await notify.save();
        user.notifications.push(notify._id);
        await user.save();
      }
    } catch (err) {
      const error = new HttpError("someting went wrong.", 500);
      return next(error);
    }
  }

  res.status(200).json({ message: "like", notify, state });
};
const getPosts = async (req, res, next) => {
  let posts, length;
  try {
    length = await Post.countDocuments();
    posts = await Post.find()
      .populate({
        path: "creator",
      })
      .sort({ createdAt: -1 })
      .skip(parseInt(req.query.skip))
      .limit(10);
  } catch (err) {
    const error = new HttpError("something went wrong", 500);
    return next(error);
  }
  res.json({
    posts,
    length,
  });
};
const getPost = async (req, res, next) => {
  const postId = req.params.id;
  let post;
  try {
    post = await Post.findById(postId).populate(
      "creator",
      "username _id img isOnline"
    );
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
const getPostComments = async (req, res, next) => {
  const postId = req.params.id;
  const { skip } = req.query;
  let post, length;
  try {
    post = await Post.findById(postId)
      .select("comments")
      .populate({
        path: "comments",
        options: {
          limit: 10,
          skip: parseInt(skip),
          sort: {
            createdAt: -1,
          },
        },
        populate: {
          path: "user",
          select: "img username isOnline _id",
        },
      });
    if (skip == 0) {
      const x = await Post.findById(postId).select("comments");
      length = x.comments.length;
    }
  } catch (err) {
    const error = new HttpError("Something went wrong.!", 500);
    return next(error);
  }
  if (!post) {
    const error = new HttpError("Something went wrong.!", 400);
    return next(error);
  }
  res.json({
    post,
    length,
  });
}; 
const createComment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data..", 422)
    );
  }
  const { userId, content, postId, img, username } = req.body;

  const comment = new Comment({
    content,
    user: userId,
  });
  let post, user;
  try {
    post = await Post.findById(postId);
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
  try {
    user = await User.findById(post.creator).select("notifications");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete post.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("could not find a post with a givern id ", 404);
    return next(error);
  }
  let notify;
  try {
    const sess = await mongoose.startSession();

    sess.startTransaction();
    await comment.save();
    if (post.creator != req.userData._id) {
      notify = new Notification({
        receiver: post.creator,
        text: `${username} commented on your post`,
        senderImg: img,
        to: postId,
      });
      if (user.unReadNotifications) {
        const l = user.unReadNotifications;
        user.unReadNotifications = parseInt(l) + 1;
      } else user.unReadNotifications = 1;
      await notify.save({ session: sess });
      await user.notifications.push(notify._id);
      await user.save({ session: sess });
    }
    post.comments.push(comment._id);
    await post.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }
  res.json({
    comment,
    notify,
  });
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
  let post, user;
  try {
    post = await Post.findById(postId).populate("creator").populate("comments");
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
    user = await User.findById(post.creator._id).select("notification");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete post.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("could not find a post with a givern id ", 404);
    return next(error);
  }
  const publicId = post.publicId;
  try {
    const sess = await mongoose.startSession();

    sess.startTransaction();
    const postNofiy = await Notification.find({ to: post._id });
    for (let i = 0; i < (postNofiy.length || post.comments.length); i++) {
      if (i < post.comments.length) {
        await Comment.findByIdAndDelete(post.comments[i]._id);
      }
      if (i < postNofiy.length) {
        const N = postNofiy[i];
        if ((N.sender = req.userData._id)) continue;
        await N.remove({ session: sess });
      }
    }

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
  if (publicId) {
    cloudinary.v2.uploader.destroy(`${publicId}`, function (err, result) {
      if (err) {
        const error = new HttpError(
          "An error occur,please try again later..",
          500
        );
        return next(error);
      }
    });
  }
  res.status(200).json({ message: "Deleted post." });
};

module.exports = {
  createPost: createPost,
  getPosts: getPosts,
  getPostComments,
  deletePost: deletePost,
  getPost: getPost,
  likePost: likePost,
  editPost,
  createComment,
};

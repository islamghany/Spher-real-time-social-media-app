const mongoose = require('mongoose');
const HttpError = require('../models/HttpError');
const Post = require('../models/post');
const User = require('../models/user');
const { validationResult } = require('express-validator');

const createPost = 	async (req,res,next)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
    const {title,body,creator} = req.body;
    const createdPost = new Post({
      title,
      body,
      creator
    })
     let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      'Creating post failed, please try again.',
      500
    );
    return next(error);
  }
   console.log(user)
  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404);
    return next(error);
  }

   try {
   	console.log(createdPost);
    const sess = await mongoose.startSession();
    console.log(2);
    sess.startTransaction();
    console.log(3);
    await createdPost.save(); 
    console.log(4);
    user.posts.push(createdPost); 
    await user.save(); 
    console.log(5);
    await sess.commitTransaction();
    console.log('nor error')
  } catch (err) {
  	console.log(err);
    const error = new HttpError(
      'Creating post failed, please try again.',
      500
    );
        console.log('error')

    return next(error);
  }
    res.status(201).json({ post: createdPost });

}
const getPosts = async (req,res,next)=>{
	let posts;
     try{
     	 posts = await Post.find();
     }catch(err){
     	const error = new HttpError('something went wrong',500);
     	return next(error);
     }
       res.json({ posts: posts.map(post => post.toObject({ getters: true })) });   
}
const getPost = async(req,res,next)=>{
	const postId = req.params.id;
	let post;
	try{ 
       post = await Post.findById(postId);
	}catch(err){
		const error = HttpError('something went wrong',500);
		return next(error);
	}
    if(!post){
    	const error = HttpError('could not find the post with the given id',404);
		return next(error);
    }
    res.json({post:post.toObject({getters:true})});
} 
const deletePost=async (req,res,next)=>{
	const postId = req.params.id;
	console.log(req.body)
	let post;
	try{
		post = await Post.findById(postId).populate('creator');
	}catch(err){
		console.log('not found');
	 const error = new HttpError(
      'Something went wrong, could not delete post.',
      500
    );
    return next(error);
	}
		console.log(post);

	if(!post){
		const error = new HttpError('could not find a post with a givern id ',404);
		return next(error);
	}
   if (post.creator.id !== req.userData._id) {
    const error = new HttpError(
      'You are not allowed to delete this post.',
      401
    );
    return next(error);
  }
	try {
		 console.log(2);
    const sess = await mongoose.startSession();
     console.log(21);
    sess.startTransaction();
     console.log(22);
    await post.remove({session: sess});
     console.log(23);
    post.creator.posts.pull(post);
     console.log(24);
    await post.creator.save({session: sess});
     console.log(25);
    await sess.commitTransaction();
  }catch (err) {
  	console.log(err)
    const error = new HttpError(
      'Something went wrong, could not delete place.',
      500
    );
    return next(error);
  }
  
  res.status(200).json({ message: 'Deleted post.' });
};

module.exports={
	createPost:createPost,
	getPosts:getPosts,
	deletePost:deletePost,
	getPost:getPost
}
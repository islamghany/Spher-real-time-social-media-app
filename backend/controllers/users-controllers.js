const { validationResult } = require('express-validator');

const HttpError = require('../models/HttpError');
const User = require('../models/user');
const Post = require('../models/post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getUsers = async (req,res,next)=>{
	let users;
	try{
		users=await User.find({},'-password')
	}catch(err){
		const error = HttpError('Fetching users failed, please try again later.',500);
		return next(error);
	}
	res.json({users:users.map(user=>user.toObject({getters:true}))});
}

const signup=async (req,res,next)=>{
  
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
    

  const { name, email, password,username } = req.body;
  let existingUser;
  try{
  	existingUser =await User.findOne({email:email});
  }catch(err){
  	const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }
    

  if(existingUser){
  	const error = new HttpError(
       'User exists already, please login instead.',
      422
    );
    return next(error);
  }
    
  let hashedPassword; 
  try{
    hashedPassword = await bcrypt.hash(password,12);
  }catch(err){
    const error= new HttpError('Could not signup, please try again.',500);
    return next(err);
  }
  const createdUser = new User({
    name,
    email,
    username,
    img: 'https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg',
    password:hashedPassword,
    posts: []
  });
  try{
  	await createdUser.save();
  }catch(err){
  	const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }
    
  let token;
  try{
    token = jwt.sign({
      _id:createdUser.id,
      email:createdUser.email,
      username:createdUser.username},
      'very-secret-password',
      {expiresIn:'1h'});
  }catch(err){
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }
  res.status(201).json({
    _id:createdUser.id,
    username:createdUser.username,
    email:createdUser.email,
    token:token });
}

const login=async(req,res,next)=>{
	const {email,password} = req.body;
	let existingUser;
	try{
		existingUser=await User.findOne({email:email})
	}catch (err) {
    const error = new HttpError(
      'Loggin in failed, please try again later.',
      500
    );
    return next(error);
  }
  if(!existingUser){
  	const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }
  let validPassword; 
  try{
    validPassword = await bcrypt.compare(password,existingUser.password);
  }catch(err){
    const error= new HttpError('Could not login, please try again.',500);
    return next(err);
  }
  if(!validPassword){
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }
  let token;
  try{
    token = jwt.sign(
      {_id:existingUser.id,
        email:existingUser.email,
        username:existingUser.username},
      'very-secret-password',
      {expiresIn:'1h'});
  }catch(err){
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({
    _id:existingUser.id,
    username:existingUser.username,
    email:existingUser.email,
    token:token });
}

module.exports={
	getUsers,
	signup,
	login
}
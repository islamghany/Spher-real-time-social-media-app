const express = require('express');
const bodyParser = require('body-parser');
const HttpError=require('./models/HttpError');
const mongoose=require('mongoose');
const postsRoutes = require('./routes/posts-routes');
const usersRoutes = require('./routes/users-routes');
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

mongoose.connect(process.env.DB_CONN).then(()=>{
	app.listen(5000);
	console.log('connected')
}).catch(err=>{
	console.log(err);
})

const express = require('express');
const postsControllers=require('../controllers/posts-controllers');
const { check } = require('express-validator');
const router = express.Router();

router.post('/',
	[check('title')
      .not()
      .isEmpty(),
      check('body')
      .not()
      .isEmpty(),
      check('creator')
      .not()
      .isEmpty()]
      ,postsControllers.createPost);
router.get('/',postsControllers.getPosts);
router.get('/:id',postsControllers.getPost);
router.delete('/:id',postsControllers.deletePost);


module.exports = router;

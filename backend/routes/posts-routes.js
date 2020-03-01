const express = require('express');
const postsControllers=require('../controllers/posts-controllers');
const { check } = require('express-validator');
const router = express.Router();
const checkAuth = require('../middlewares/check-auth');

router.get('/',postsControllers.getPosts);
router.get('/:id',postsControllers.getPost);

router.use(checkAuth);

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
router.delete('/:id',postsControllers.deletePost);


module.exports = router;

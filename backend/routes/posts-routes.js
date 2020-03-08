const express = require('express');
const postsControllers=require('../controllers/posts-controllers');
const { check } = require('express-validator');
const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
router.get('/',postsControllers.getPosts);
router.get('/:id',postsControllers.getPost);
const upload = require('../middlewares/upload-image')
router.use(checkAuth);
router.post('/',
	upload.single('img'),
	[
      check('creator')
      .not()
      .isEmpty()
      ],postsControllers.createPost);
router.patch('/post',
	[
      check('creator')
      .not()
      .isEmpty(),
       check('postId')
      .not()
      .isEmpty()
      ],postsControllers.likePost);
      
router.patch('/edit/:id',[check('title').not().isEmpty()],postsControllers.editPost);

router.delete('/:id',postsControllers.deletePost);


module.exports = router;

const upload = require('../middlewares/upload-image')
const express = require('express');
const postsControllers=require('../controllers/posts-controllers');
const { check } = require('express-validator');
const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
router.get('/',postsControllers.getPosts);
router.get('/:id',postsControllers.getPost);
router.get('/comments/:id',postsControllers.getPostComments);

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
router.post('/comments/create',[check('content').not().isEmpty()],postsControllers.createComment)
router.delete('/:id',postsControllers.deletePost);


module.exports = router;

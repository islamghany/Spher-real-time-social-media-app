const express = require('express');
const { check } = require('express-validator');
const upload = require('../middlewares/upload-image.js');
const usersController = require('../controllers/users-controllers');
const router = express.Router();
router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUser);
router.post('/img/:id',upload.single('img'),usersController.changeImg);
router.post(
  '/signup',
  [
      check('name')
        .not()
        .isEmpty(),
        check('username')
        .not()
        .isEmpty(),
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password').isLength({ min: 6 })
  ],
  usersController.signup
);

router.post('/login', usersController.login);

module.exports = router;

const express = require('express');
const { check } = require('express-validator');
const usersController = require('../controllers/users-controllers');
const upload = require('../middlewares/upload-image')

const router = express.Router();
router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUser);
router.post('/img/:id',upload.single('img'),
usersController.changeImg);
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
router.get('/notifications/:id', usersController.getUserNotifications);

router.patch(
  '/change-password/:id',
  [
    check('newPassword').isLength({ min: 6 }),
    check('oldPassword').isLength({ min: 6 }),
    check('confirmPassword').isLength({ min: 6 }),
  ],
  usersController.changePassword
);
router.get('/rooms/:id', usersController.userRooms);
router.post('/clear/:id',usersController.clearUnReadNotifications);
router.patch(
  '/update-info/:id',
  usersController.updateInfo
);

module.exports = router;

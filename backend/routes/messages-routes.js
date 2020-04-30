const express = require('express');
const messageController = require('../controllers/message-controller');
const checkAuth = require('../middlewares/check-auth');
const upload = require('../middlewares/upload-image')

const router = express.Router();

router.use(checkAuth);
router.post('/send',upload.single('img'),messageController.sendMessage);
router.post('/',messageController.getMessages);


module.exports = router;
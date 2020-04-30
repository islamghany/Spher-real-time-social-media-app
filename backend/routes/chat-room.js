const express = require('express');
const chatRoomController = require('../controllers/chatRoom-controller');

const router = express.Router();

router.post('/create',chatRoomController.createRoom);
router.get('/get/:id',chatRoomController.chatRoomInfo);

module.exports = router;
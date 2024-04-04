const express = require('express');
const {
    getMessages,
    getMessage,
    createMessage,
    deleteMessage,
    updateMessage
} = require('../controllers/messageController');

const router = express.Router();

router.get("/", getMessages);

router.get("/:id", getMessage);

router.post("/", createMessage);

router.delete("/:id", deleteMessage);

router.patch("/:id", updateMessage);


module.exports = router;
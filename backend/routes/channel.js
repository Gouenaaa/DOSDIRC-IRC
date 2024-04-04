const express = require('express');
const {
    getChannels,
    getChannel,
    createChannel,
    deleteChannel,
    updateChannel,
    getMessages,
    getChannelsByUser,
    getChannelByName,
    doAction,
    getChannelsByName
} = require('../controllers/channelController');

const router = express.Router();

router.get("/", getChannels);

router.get("/:id", getChannel);

router.get("/channels/:name", getChannelsByName)

router.post("/", createChannel);

router.delete("/:id", deleteChannel);

router.patch("/:id", updateChannel);

router.get("/:id/messages", getMessages);

router.get("/user/:id", getChannelsByUser);

router.get("/name/:name", getChannelByName);

router.patch("/action/:action", doAction);

module.exports = router;
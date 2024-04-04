const mongoose = require('mongoose');
const Message = require('../models/messageModel');

const getMessages = async (req, res) => {
    const messages = await Message.find({});

    res.status(200).json(messages);
}

const getMessage = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such Message.'});
    }

    const message = await Message.findById(id);

    if(!message){
        return res.status(404).json({error: 'No such message.'});
    }

    res.status(200).json(message);
}

const createMessage = async (req, res) => {
    const {
        content,
        author,
        channel
    } = req.body;

    try {
        const message = await Message.create({
            content, 
            author, 
            channel
        });
        res.status(200).json(message);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const deleteMessage = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such Message.'});
    }

    const message = await Message.findByIdAndDelete(id);

    if(!message){
        return res.status(404).json({error: 'No such message.'});
    }

    res.status(200).json(message);
}

const updateMessage = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such Message.'});
    }

    const message = await Message.findByIdAndUpdate(id, {
        ...req.body
    });

    if(!message){
        return res.status(404).json({error: 'No such message.'});
    }

    res.status(200).json(message);
}

module.exports = {
    getMessages,
    getMessage,
    createMessage,
    deleteMessage,
    updateMessage
}
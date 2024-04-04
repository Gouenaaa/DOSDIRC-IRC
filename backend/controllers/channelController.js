const mongoose = require('mongoose');
const Channel = require('../models/channelModel');
const Message = require('../models/messageModel');

const getChannels = async (req, res) => {
    const channels = await Channel.find({});

    res.status(200).json(channels);
}

const getChannelsByName = async (req, res) => {
    let channels;
    if(req.params.name === "*")
        channels = await Channel.find({private: false });
    else
        channels = await Channel.find({name: { $regex: `.*${req.params.name}.*` }, private: false });


    res.status(200).json(channels);
}
const getChannel = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such Channel.'});
    }

    const channel = await Channel.findById(id);

    if(!channel){
        return res.status(404).json({error: 'No such Channel.'});
    }

    res.status(200).json(channel);
}

const createChannel = async (req, res) => {
    const {
        name,
        owner,
        participants,
        private
    } = req.body;

    try {
        const channel = await Channel.create({
            name,
            owner,
            participants,
            private
        });
        res.status(200).json(channel);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const deleteChannel = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such Channel.'});
    }

    const message = await Message.deleteMany({channel: id});
    const channel = await Channel.findByIdAndDelete(id);

    if(!channel){
        return res.status(404).json({error: 'No such Channel.'});
    }

    res.status(200).json(channel);
}

const updateChannel = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such Channel.'});
    }

    const channel = Channel.findByIdAndUpdate(id, {
        ...req.body
    });

    if(!channel){
        return res.status(404).json({error: 'No such Channel.'});
    }
    
    res.status(200).json(channel);
}

const getMessages = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such Channel.'});
    }

    const messages = await Message.find({
        channel: id
    }).sort({createdAt: -1});

    res.status(200).send(messages);
}

const getChannelsByUser = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such User.'});
    }

    const channels = await Channel.find({
        participants: id
    }).populate('participants');

    res.status(200).send(channels);
}

const getChannelByName = async (req, res) => {
    const { name } = req.params;

    const channel = await Channel.findOne({
        name: name
    });

    if(!channel){
        return res.status(404).json({error: 'No such Channel.'});
    }
    
    res.status(200).send(channel);
}

const doAction = async (req, res) => {
    const { action } = req.params;
    const { channelId, userId } = req.body;

    if(!mongoose.Types.ObjectId.isValid(channelId)){
        return res.status(400).json({error: 'No such Channel.'});
    }
    if(!mongoose.Types.ObjectId.isValid(userId)){
        return res.status(400).json({error: 'No such User.'});
    }

    let channel;
    switch(action){
        case 'join': {
            channel = await Channel.findByIdAndUpdate(channelId, {
                $push: {
                    participants: userId
                }
            });
            break;
        }
        case 'quit': {
            channel = await Channel.findByIdAndUpdate(channelId, {
                $pull: {
                    participants: userId
                }
            });
            break;
        }
        default: {
            return res.status(400).json({error: 'Unknow action.'});
        }
    }

    if(!channel){
        return res.status(404).json({error: 'No such Channel.'});
    }

    res.status(200).send(channel);
}

module.exports = {
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
}
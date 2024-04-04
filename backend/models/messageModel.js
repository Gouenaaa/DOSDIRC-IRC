const mongoose = require('mongoose');
const User = require('./userModel');
const Channel = require('./channelModel');
const { ObjectId } = require('mongodb');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    channel: {
        type: ObjectId,
        ref: 'Channel',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
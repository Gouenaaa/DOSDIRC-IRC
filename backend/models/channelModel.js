const mongoose = require('mongoose');
const User = require('./userModel');
const { ObjectId } = require('mongodb');

const Schema = mongoose.Schema;

const channelSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    participants: {
        type: [ObjectId],
        ref: 'User',
        required: true
    },
    private: {
        type: Boolean,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Channel', channelSchema);
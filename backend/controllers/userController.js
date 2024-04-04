const mongoose = require('mongoose');
const User = require('../models/userModel');
const Channel = require('../models/channelModel');
const bcrypt = require("bcrypt");
const validator = require('validator')
const jwt = require('jsonwebtoken');
const {json} = require("express");

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET);
}

const loginUser = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        res.status(400).json({error: "All fileds must be filled"});
    }else {
        const user = await User.findOne({email: email});

        if(!user)
            res.status(404).json({error: "Invalid credentials"});
        else{
            const match = await bcrypt.compare(password, user.password)

            if(!match){
                res.status(400).json({error: "Invalid credentials"});
            } else {

                const token = createToken(user._id);

                res.status(200).json({email, token})
            }
        }
    }
}

const singUpUser = async (req, res) => {
    const {email, username, password} = req.body;

    if (!email || !username || !password) {
        res.status(400).json({error: "All fileds must be filled"});
    } else if (!validator.isEmail(email)) {
        res.status(400).json({error: "Please enter a valid email"})
    } else if (!validator.isStrongPassword(password)) {
        res.status(400).json({error: "Please enter a strong password"})
    } else {
        const emailExists = await User.findOne({email: email});
        const usernameExists = await User.findOne({username: username});

        if (emailExists) {
            res.status(400).json({error: "Email already use by " + email});
        } else if (usernameExists) {
            res.status(400).json({error: "Username already use by " + username});
        } else {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            const user = await User.create({
                email: email, username: username, password: hash
            });

            const token = createToken(user._id);

            const channelGeneral = "65c200b5314984e99cb4f7cd";
            await Channel.findByIdAndUpdate(channelGeneral, {
                $push: {
                    participants: user._id
                }
            });

            res.status(200).json({email, token});
        }
    }
}

const getUsers = async (req, res) => {
    const users = await User.find({});

    res.status(200).json(users);
}

const getUserByName = async (req, res) => {
    const username = req.params.name;

    const user = await User.findOne({username: username});

    res.status(200).json(user);
}
const getUser = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such User.'});
    }

    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({error: 'No such User.'});
    }

    res.status(200).json(user);
}

const createUser = async (req, res) => {
    const {
        username,
        password
    } = req.body;

    try {
        const user = await User.create({
            username,
            password
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const deleteUser = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such User.'});
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
        return res.status(404).json({error: 'No such User.'});
    }

    res.status(200).json(user);
}
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username } = req.body;
  
    const updatedUser = await User.findByIdAndUpdate(id, { username }, { new: true });
  
    if (updatedUser) {
      res.json({
        success: true,
        data: updatedUser
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
  };

const getChannelUsers = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such Channel'})
    }

    const channel = await Channel.findById(id);
    const participants = channel.participants

    const users = await User.find({_id: {$in: participants}})

    res.status(200).json(users)
}

module.exports = {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser,
    loginUser,
    singUpUser,
    getChannelUsers,
    getUserByName
}
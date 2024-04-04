const express = require('express');
const {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser,
    loginUser,
    singUpUser,
    getChannelUsers,
    getUserByName
} = require('../controllers/userController');

const router = express.Router();

router.get("/", getUsers);

router.get("/:id", getUser);
router.get("/name/:name", getUserByName)

// login route

router.post('/login', loginUser);

// singup route

router.post('/signup', singUpUser);

router.post("/", createUser);

router.delete("/:id", deleteUser);

router.patch("/:id", updateUser);

router.get("/channel/:id", getChannelUsers);

module.exports = router;
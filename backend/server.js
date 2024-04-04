require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const userRoutes = require('./routes/user');
const channelRoutes = require('./routes/channel');
const messageRoutes = require('./routes/message');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origins: ["http://localhost:3000", "http://localhost:3001"]
    }
});

app.use(express.json());
app.use((req, use, next) => {
    // console.log(req.path, req.method);
    next();
});

app.use('/api/user', userRoutes);
app.use('/api/channel', channelRoutes);
app.use("/api/message", messageRoutes);

let userMap = new Map();

io.on('connection', (socket) => {
    console.log(`user connected: ${socket.id}`);

    socket.on("disconnect", () => {
        userMap.forEach((value, key) => {
            if(value === socket.id){
                userMap.delete(key);
            }
        })
        console.log(userMap)
    })

    socket.on("join_channel", async (channel, user) => {
        if (!userMap.has(user) || userMap.get(user) !== socket.id) {
            userMap.set(user, socket.id);
        }
        console.log(userMap)
        if (!socket.rooms.has(channel._id)) {
            socket.join(channel._id);
            console.log(`${socket.id} joined ${channel._id}`);
        }

        if(channel.private && userMap.has(channel.participants[1])){
            socket.to(userMap.get(channel.participants[1])).emit("recieve_private", channel);
        }
    });

    socket.on("quit_channel", async (channel) => {
        socket.leave(channel);
        console.log(`${socket.id} leaved ${channel}`);
    })

    socket.on("delete_channel", (channel) => {
        io.to(channel).emit("channel_deleted", channel);
        io.socketsLeave(channel._id);
    });

    socket.on("send_message", (data) => {
        mongoose.model('Message').create({
            content: data.content,
            author: data.author,
            channel: data.channel
        })
            .then(
                io.to(data.channel).emit("recieve_message", data)
            );
    });
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("Listening on port 4000.");
        });
    })
    .catch((error) => {
        console.log(error);
    });

server.listen(4001, () => {
    console.log("Listening on port 4001. (socket)")
})
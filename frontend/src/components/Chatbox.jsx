import React, {useEffect, useState, useRef} from 'react';
import Message from './Message';
import {decodeToken} from 'react-jwt';
import {IoIosSend} from "react-icons/io";
import channel from "./Channel";


const Chatbox = ({
                     socket,
                     setChannels,
                     currentChannel,
                     setCurrentChannel,
                     sendNotification,
                     getChannelByName,
                     user,
                     handleChannelDeletion,
                     setCurrentChannelUsers,
                     returnToGeneral,
                     setPrivateName,
                     privateName
                 }) => {
    const [messages, setMessages] = useState([]);
    const author = decodeToken(localStorage.getItem("token"))._id;
    const inputRef = useRef(null);
    const [currentChannelUsers, setCCUsers] = useState([]);


    useEffect(() => {
        socket.off()
        socket.on("recieve_message", (message) => {
            if (message.channel === currentChannel._id) {
                setMessages(messages => [message, ...messages]);
            } else {
                sendNotification(message);
            }
        });

        const fetchPreviousMessages = async () => {
            const response = await fetch(`/api/channel/${currentChannel._id}/messages`);
            const json = await response.json();
            if (response.ok) {
                setMessages(json);
            }
        }

        const fetchCurrentChannelUsers = async () => {
            const response = await fetch(`/api/user/channel/${currentChannel._id}`);
            const users = await response.json();

            if (response.ok) {
                setCurrentChannelUsers(users)
                setCCUsers(users)
            }
        }
        !(currentChannel._id === undefined) && fetchCurrentChannelUsers() && fetchPreviousMessages();
    }, [currentChannel]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            send();
        }
    };

    const send = (msg = "", channel = currentChannel) => {
        let messageContent;
        if (msg !== "") {
            messageContent = msg;
        } else {
            messageContent = inputRef.current.value.trim();
        }
        if (messageContent !== '') {
            if (messageContent.slice(0, 1) === "/") {
                handleCommand(messageContent);
            } else {
                const message = {
                    content: messageContent,
                    author: author,
                    channel: channel._id,
                    createdAt: new Date(Date.now()),
                }
                socket.emit("send_message", message);
            }
            inputRef.current.value = '';
        }
    }

    const sendErrorMessage = (message) => {

        const saveMessages = messages
        setMessages(oldMessages => [{
            author: user._id,
            channel: currentChannel._id,
            content: message,
            createdAt: new Date(Date.now()),
        }, ...oldMessages]);

        setTimeout(() => {
            setMessages(saveMessages)
        }, 5000)

    }

    function usersChannel() {

        let message = "Liste des utilisateurs du channel : " + Array.of(currentChannelUsers.map((user) => {
            return user.username;
        }))[0].join(", ");
        setMessages(oldMessages => [{
            author: user._id,
            channel: currentChannel,
            content: message,
            createdAt: new Date(Date.now()),
        }, ...oldMessages]);

    }

    const listChannel = async (commandElement) => {
        let response;
        let channels;
        if (commandElement !== "") {
            response = await fetch(`/api/channel/channels/${commandElement}`);
            channels = await response.json();
        } else {
            response = await fetch(`/api/channel/channels/*`);
            channels = await response.json();
        }
        if (response.ok) {
            let message;
            if (channels.length > 0) {
                message = `Liste des channels publiques disponibles ${commandElement !== "" ? `pour "${commandElement}" ` : ""}: ` + Array.of(channels.map((channel) => {
                    return channel.name;
                }))[0].join(", ");
            } else {
                message = `Aucun channel ${commandElement !== "" ? `pour "${commandElement}" ` : ""}`
            }
            setMessages(oldMessages => [{
                author: user._id,
                channel: currentChannel,
                content: message,
                createdAt: new Date(Date.now()),
            }, ...oldMessages]);
        }
        return null;
    }

    const sendPrivateMessage = async (command) => {
        let errorMessage, privChannel;
        const username = command[1];
        let message = "";
        for (let i = 2; i < command.length; i++) {
            message += command[i] + " ";
        }
        if (username === "admin") {
            errorMessage = `Utilisateur ${username} n'existe pas !`
            setMessages(oldMessages => [{
                author: user._id,
                channel: currentChannel,
                content: errorMessage,
                createdAt: new Date(Date.now()),
            }, ...oldMessages]);
            return null;
        } else if (username === user.username) {
            errorMessage = `Vous ne pouvez pas vous envoyer de messages privés !`
            setMessages(oldMessages => [{
                author: user._id,
                channel: currentChannel,
                content: errorMessage,
                createdAt: new Date(Date.now()),
            }, ...oldMessages]);
            return null;
        }

        const responseUser = await fetch(`/api/user/name/${username}`);
        const userMsg = await responseUser.json();

        if (responseUser.ok) {
            if (userMsg === null) {
                errorMessage = `Utilisateur ${username} n'existe pas !`
                setMessages(oldMessages => [{
                    author: user._id,
                    channel: currentChannel,
                    content: errorMessage,
                    createdAt: new Date(Date.now()),
                }, ...oldMessages]);
            }
            const created = await createChannel(`${user.username}:${userMsg.username}`, true, userMsg);
            const responseChannel = await fetch(`/api/channel/name/${user.username}:${userMsg.username}`)
            privChannel = await responseChannel.json();
            setPrivateName(userMsg.username)
            if (responseChannel.ok) {
                if (currentChannel !== privChannel)
                    setCurrentChannel(privChannel);
            }
        }
        send(message, privChannel);
    };

    const helpCommand = () => {

        const saveMessages = messages
        let message = ["/help : montre ce message.",
            "/create {channelName} : créer un channel",
            "/join {channelName} : rejoindre un channel",
            "/delete {channelName} : supprimer un channel",
            "/users : afficher tous les utilisateurs dans le channel où la commande est executée",
            "/list [optionnalChars] : lister les channels publiques",
            "/msg {username} {message} : envoyer un message privé à quelqu'un",
            "/quit {channelName} : quitter un channel",
            "/nick {username} : changer son nom dans le serveur"]

        message.map((mess) => {
            setMessages(oldMessages => [{
                author: user._id,
                channel: currentChannel,
                content: mess,
                createdAt: new Date(Date.now()),
            }, ...oldMessages]);
        })

        setTimeout(() => {
            setMessages(saveMessages)
        }, 20000)
    };
    const handleCommand = (command) => {
        command = command.split(" ");
        switch (command[0]) {
            case "/create": {
                command.length === 2 ? createChannel(command[1]) : sendErrorMessage("Argument invalide ! La commande doit ressembler à /create {channelName}");
                break;
            }
            case "/join": {
                command.length === 2 ? joinChannel(command[1]) : sendErrorMessage("Argument invalide ! La commande doit ressembler à /join {channelName}");
                break;
            }
            case "/delete": {
                command.length === 2 ? deleteChannel(command[1]) : sendErrorMessage("Argument invalide ! La commande doit ressembler à /delete {channelName}");
                break;
            }
            case "/users": {
                command.length === 1 ? usersChannel(command[0]) : sendErrorMessage("Argument invalide ! La commande doit ressembler à /users");
                break;
            }
            case "/list": {
                if (command.length === 1)
                    command.push("");
                command.length === 2 ? listChannel(command[1]) : sendErrorMessage("Argument invalide ! La commande doit ressembler à /list [optional]");
                break;
            }
            case "/msg": {
                command.length >= 3 ? sendPrivateMessage(command) : sendErrorMessage("Arguments invalides ! La commande doit ressembler à /msg {username} {message}");
                break;
            }
            case "/quit": {
                command.length === 2 ? quitChannel(command[1]) : sendErrorMessage("Argument invalide ! La commande doit ressembler à /quit {channelName}");
                break;
            }
            case "/nick": {
                if (command.length === 2) {
                    const userId = decodeToken(localStorage.getItem("token"))._id;
                    changeNickname(command[1], userId);
                } else {
                    sendErrorMessage("Argument invalide La commande doit ressembler à /nick newNickname");
                }
                break;

            }
            case "/help" : {
                command.length === 1 ? helpCommand() : sendErrorMessage("")
                break;
            }
            default: {
                helpCommand();
            }
        }
    }

    const createChannel = async (name, priv = false, secondUser = null) => {
        const response = await fetch('/api/channel/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                owner: user._id,
                participants: true === priv ? [user._id, secondUser._id] : [user._id],
                private: priv
            })
        });
        const channel = await response.json();
        if (response.ok) {
            socket.emit("join_channel", channel, user._id);
            setChannels(oldChannels => [...oldChannels, channel]);
            setCurrentChannel(channel);
            return true;
        } else {
            sendErrorMessage(`Channel "${name}" already exists.`);
            return false;
        }
    }

    const changeNickname = async (name, userId) => {

        const response = await fetch(`/api/user/${userId}`, {
            method: "PATCH",
            body: JSON.stringify({
                username: name
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log(response.ok);
        if (response.ok) {
            window.location.reload();
        } else {
            sendErrorMessage("Ce nom d'utilisateur est deja utilisé");
        }
    }


    const joinChannel = async (name) => {
        const response = await fetch(`/api/channel/name/${name}`);
        const channel = await response.json();
        if (response.ok) {
            if (channel.participants.includes(user._id)) {
                sendErrorMessage(`Vous êtes déjà dans "${name}".`);
            } else if (true === channel.private) {
                sendErrorMessage(`Ce channel n'existe pas : ${name}`);
            } else {
                const response = await fetch(`/api/channel/action/join`, {
                    method: "PATCH",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        channelId: channel._id,
                        userId: user._id
                    })
                });
                if (response.ok) {
                    socket.emit("join_channel", channel, user._id);
                    const message = {
                        content: `${user.username} a rejoin le channel.`,
                        author: user._id,
                        channel: channel._id,
                        createdAt: new Date(Date.now()),
                    }
                    socket.emit("send_message", message);
                    setChannels(oldChannels => [...oldChannels, channel]);
                    setCurrentChannel(channel);
                }
            }
        } else {
            sendErrorMessage(`Ce channel n'existe pas : ${name}`);
        }
    }

    const deleteChannel = async (name) => {
        const channel = getChannelByName(name);
        if (channel) {
            if (channel.owner === user._id) {
                const response = await fetch(`/api/channel/${channel._id}`, {
                    method: "DELETE",
                    mode: "cors"
                });
                if (response.ok) {
                    handleChannelDeletion(channel._id);
                }
            } else {
                sendErrorMessage(`Tu ne peux pas supprimer un channel qui ne t'appartient pas !`);
            }
        } else {
            sendErrorMessage(`Ce channel n'existe pas : ${name}`);
        }
    }

    const quitChannel = async (name) => {
        const channel = getChannelByName(name);
        if (channel) {
            if (channel.owner === user._id) {
                sendErrorMessage(`Quitter ce channel le supprimera. Tu peux confirmer en écrivant /delete ${name}`);
            } else {
                const response = await fetch(`/api/channel/action/quit`, {
                    method: "PATCH",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        channelId: channel._id,
                        userId: user._id
                    })
                })
                if (response.ok) {
                    socket.emit("quit_channel", channel._id);
                    const message = {
                        content: `${user.username} a quitté ce channel.`,
                        author: user._id,
                        channel: channel._id,
                        createdAt: new Date(Date.now()),
                    }
                    socket.emit("send_message", message);
                    setChannels(oldChannels => oldChannels.filter((c) => c._id !== channel._id));
                    if (currentChannel._id === channel._id) {
                        returnToGeneral();
                    }
                }
            }
        } else {
            sendErrorMessage(`Tu ne peux pas quitter un channel si tu n'es pas dedans.`);
        }
    }

    let channelName = "";
    if (currentChannel.private === true) {
        currentChannel.participants.map((participant) => {
            if (participant._id !== user._id) {
                if (participant.username === undefined)
                    channelName = privateName
                else
                    channelName = participant.username
            }
        })
    } else {
        channelName = currentChannel.name
    }

    return (
        <div key={currentChannel._id} className="flex flex-col-reverse w-[74%] h-full ">
            <div className={"flex mb-2"}>
                <input
                    ref={inputRef}
                    id='input'
                    type="text"
                    placeholder={`Envoyer un message à ${channelName}`}
                    onKeyPress={handleKeyPress}
                    className="p-2 bg-[#383a40] text-[#dbdee1] h-10 rounded-bl-[5px] rounded-tl-[5px] ml-2 w-[97%]"
                />
                <button onClick={send}
                        className="flex justify-center items-center text-xl text-[#dbdee1] bg-[#383a40] h-10 mr-2 rounded-br-[5px] rounded-tr-[5px] w-[3%]">
                    <IoIosSend/>
                </button>
            </div>
            <div id='messages' className={"overflow-y-scroll h-full flex flex-col-reverse gap-4 pb-2"}>
                {messages.map((message, index) =>
                    <Message key={message._id} message={message}
                             currentChannelUsers={currentChannelUsers} prevMessage={messages[index + 1]}/>
                )}
            </div>
            <div className={"flex flex-col text-2xl text-white justify-center h-[50px] bg-[#313338] title"}>
                <p className={"text-white text-2xl my-4 ml-2"}>{channelName}</p>
            </div>
        </div>
    );

}


export default Chatbox;

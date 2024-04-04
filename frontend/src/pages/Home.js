import Channel from "../components/Channel";
import Chatbox from "../components/Chatbox";
import React, {useEffect, useState} from "react";
import io from 'socket.io-client';
import {decodeToken} from 'react-jwt';
import Profil from "../components/Profil";
import Users from "../components/Users";

const socket = io.connect("http://localhost:4001");

const Home = () => {
    const [channels, setChannels] = useState([]);
    const [currentChannel, setCurrentChannel] = useState({});
    const [unreadChannels, setUnreadChannels] = useState([]);
    const [user, setUser] = useState(null);
    const [currentChannelUsers, setCurrentChannelUsers] = useState([]);
    const [general, setGeneral] = useState({});
    const [privateName, setPrivateName] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch("/api/user/" + decodeToken(localStorage.getItem('token'))._id);
            const user = await response.json();

            if (response.ok) {
                setUser(user)
            }
        }
        fetchUser();

        socket.on("channel_deleted", id => {
            setChannels(channels.filter(channel => channel._id !== id));
            currentChannel._id === id && returnToGeneral();
        })

        socket.on("recieve_private", channel => {
            if(!channels.includes(channel)){
                setPrivateName(channel.name.split(":")[0])
                channels.push(channel)
                unreadChannels.push(channel._id)
            }
        })
    });

    const getChannelByName = (name) => {
        let res;
        channels.map(channel => {
            if (channel.name === name){
                res = channel;
            }
        });
        return res;
    }

    const getChannelById = (id) => {
        let res;
        channels.map(channel => {
            if (channel._id === id){
                res = channel;
            }
        });
        return res;
    }

    const handleChannelDeletion = (id) => {
        channels.map(channel => {
            if (channel._id === id){
                channels.splice(channels.indexOf(channel), 1);
                socket.emit("delete_channel", id);
                currentChannel._id === id && setCurrentChannel(general);
            }
        })
    }

    const returnToGeneral = () => {
        setCurrentChannel(general);
    }


    const sendNotification = (message) => {
        if (message.channel !== currentChannel._id && !unreadChannels.includes(message.channel) && message.author !== decodeToken(localStorage.getItem('token'))._id) {
            unreadChannels.push(message.channel);
        }
    }

    useEffect(() => {
        const fetchChannels = async () => {
            const response = await fetch(`/api/channel/user/${decodeToken(localStorage.getItem('token'))._id}`);
            const json = await response.json();

            if (response.ok) {
                setChannels(json);
                json.map(channel => {
                    socket.emit("join_channel", channel, decodeToken(localStorage.getItem('token'))._id);
                    if(channel.name === "Général"){
                        setGeneral(channel);
                        setCurrentChannel(channel);
                    }
                });
            }
        }
        fetchChannels()
    }, [socket])

    useEffect(() => {
        if (unreadChannels.includes(currentChannel._id)) {
            setUnreadChannels(unreadChannels.filter(channel => channel !== currentChannel._id))
            console.log(unreadChannels)
        }
    }, [currentChannel])

    return (
        <div className="home bg-[#313338] flex">
            <div className={"h-full w-[13%] bg-[#23272a] shadow-2xl flex flex-col"}>
                <div className={"flex flex-col items-center justify-center w-full h-[50px] mb-4 title"}>
                    <p className={"text-white text-2xl my-4"}>Dosdirc</p>
                </div>
                <div className={"flex flex-col gap-4 w-full items-center h-[92%] overflow-y-scroll"}>
                    <Channel key={general._id} unread={false} channel={general}
                             setCurrentChannel={setCurrentChannel} isCurrent={general._id === currentChannel._id} user={user} privateName={privateName}/>

                    {channels && channels.map((channel) => {
                        let unread = false;
                        if (unreadChannels.includes(channel._id) && channel._id !== currentChannel._id) {
                            unread = true
                        }
                        if (channel._id === general._id ) {
                            return null;
                        }
                        return (
                            <Channel key={channel._id} unread={unread} channel={channel}
                                setCurrentChannel={setCurrentChannel} isCurrent={channel._id === currentChannel._id} user={user} privateName={privateName}/>
                        );
                    })}
                </div>
                {user != null &&
                    <Profil user={user} />
                }
            </div>
            <Chatbox socket={socket} setChannels={setChannels} currentChannel={currentChannel} setCurrentChannel={setCurrentChannel} sendNotification={sendNotification} getChannelByName={getChannelByName} user={user} handleChannelDeletion={handleChannelDeletion}  setCurrentChannelUsers={setCurrentChannelUsers} returnToGeneral={returnToGeneral} privateName={privateName} setPrivateName={setPrivateName}/>
            <Users currentChannelsUsers={currentChannelUsers} currentChannel={currentChannel}/>
        </div>
    )
}

export default Home
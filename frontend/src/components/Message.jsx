import React, {useState, useEffect, useRef} from "react";
import {FaUser} from "react-icons/fa";

const Message = ({message, currentChannelUsers, prevMessage}) => {
    const [username, setUsername] = useState(null);


    useEffect(() => {
        currentChannelUsers.map((user) => {
            if (message.author === user._id)
                setUsername(user.username)
        })
    })
    const messDate = new Date(message.createdAt)
    const formatDate = () => {
        let day, month, year;
        day = messDate.getDay()
        if (day < 10)
            day = "0" + day
        month = messDate.getMonth() + 1
        if (month < 10)
            month = "0" + month
        year = messDate.getFullYear()
        return day + "/" + month + "/" + year
    }

    const formatHour = () => {
        let hour, min;
        hour = messDate.getHours();
        if (hour < 10)
            hour = "0" + hour
        min = messDate.getMinutes();
        if (min < 10)
            min = "0" + min
        return hour + ":" + min
    }

    const today = new Date(Date.now())

    if (username) {

        return (
            <>
                {undefined !== prevMessage && message.author === prevMessage.author ?
                    <div className={"group"}>
                        <div className="flex text-white hover:bg-[#2E3035] gap-4 pl-2 ">
                            <div className={"w-[50px] max-w-[50px] min-w-[50px] flex justify-center items-center"}>
                                <p className={"opacity-0 group-hover:opacity-100 transition-all duration-300-150 text-gray-500 text-sm"}>{formatHour()}</p>
                            </div>
                            <div className={"w-11/12"}>
                                <span className={"block break-words"}>{message.content}</span>
                            </div>
                        </div>
                    </div>

                    :
                    <div className="flex text-white hover:bg-[#2E3035] gap-4 pl-2 ">
                        <div
                            className={"w-[50px] max-w-[50px] min-w-[50px] h-[50px] max-h-[50px] min-h-[50px] rounded-full bg-blue-500 text-white text-2xl flex justify-center items-center"}>
                            <FaUser/>
                        </div>
                        <div className={"w-11/12"}>
                            <div className={"flex gap-2 items-end"}>
                                <p className={"text-[#f2f3f5]"}>{username}</p>
                                <p className={"text-gray-500 text-sm"}>{messDate.getDate() == today.getDate() ? `Aujourd'hui à ` : `${formatDate()} `} {formatHour()}</p>
                            </div>
                            <span className={"block break-words"}>{message.content}</span>
                        </div>

                    </div>
                }
            </>
        );
    } else {
        return null
    }
}

export default Message;

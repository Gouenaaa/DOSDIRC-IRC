import React from 'react';
import Channel from "./Channel";
import Profil from "./Profil";

function Users({currentChannelsUsers, currentChannel}) {
    return (
        <div className={"h-full w-[13%] bg-[#23272a] shadow-2xl flex flex-col"}>
            <div className={"flex flex-col items-center w-full h-[8%]"}>
                <div className={"flex flex-col items-center justify-center w-full h-[50px] mb-4 title"}>
                    <p className={"text-white text-2xl my-4"}>Utilisateurs</p>
                </div>
                <div className={"flex flex-col"}>
                    {currentChannelsUsers.map((user) => {
                        return (<p key={user._id}
                                   className={"ml-2 w-[230px] flex gap-5 items-center text-[#949ba4] px-2 py-1 hover:bg-[#4e5058] hover:rounded-[4px] hover:bg-opacity-60 hover:text-[#dbdee1]"}>{user.username}</p>)
                    })}
                </div>

            </div>
        </div>
    );
}

export default Users;
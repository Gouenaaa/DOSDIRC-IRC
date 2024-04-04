const Channel = ({ unread, channel, setCurrentChannel, isCurrent, user, privateName }) => {

    let channelName = "";
    if (channel.private === true){
        channel.participants.map((participant) => {
            if(participant._id !== user._id) {
                if(participant.username === undefined)
                    channelName = privateName
                else
                    channelName = participant.username
            }
        })
    } else {
        channelName = channel.name
    }

    return (
        <div className={"ml-2 w-[230px] flex gap-5 items-center px-2 py-1 hover:bg-[#4e5058] hover:rounded-[4px] hover:bg-opacity-60 hover:text-[#dbdee1]" + (isCurrent ?
            " text-white bg-[#4e5058] rounded-[4px] bg-opacity-30"
            :
            " text-[#949ba4]")}
            onClick={() => setCurrentChannel(channel)}
        >
            <div className="h-[55px] aspect-square bg-gray-700 rounded-full flex justify-center items-center relative">
                {true === unread &&
                    <span className={"h-[10px] w-[10px] rounded-full absolute top-[2px] left-[42px] bg-[#ff0000]"}/>
                }
                <img src={"logoBlanc.png"} className={unread ? "h-[50%] animate-pulse" : "h-[50%]"} alt={"logo"}/>
            </div>
            <p className={"text-xl truncate"}>{channelName}</p>
        </div>
    );
}

export default Channel;
import React from 'react';
import {useLogout} from "../hooks/useLogout";
import { FaUser } from "react-icons/fa";
import { FaArrowRightFromBracket } from "react-icons/fa6";

const Profil = ({user}) => {
    const {logout} = useLogout();


    return (
        <div className={"h-[50px] w-full px-2 py-[5px] bg-[#232428] flex justify-between "}>
            <div className={"flex gap-4 items-center"}>
                <div className={"w-[40px] aspect-square rounded-full bg-blue-500 text-white flex justify-center items-center"}>
                    <FaUser />
                </div>
                <p className={"text-white"}>{user.username}</p>
            </div>

            <div className={"w-[40px] aspect-square rounded-full bg-blue-500 text-white hover:cursor-pointer flex justify-center items-center"} onClick={logout}>
                <FaArrowRightFromBracket />
            </div>
        </div>
    )
}


export default Profil;
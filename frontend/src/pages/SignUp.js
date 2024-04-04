import {useEffect, useState} from "react";
import {useSignup} from "../hooks/useSignup";
import {Link, useNavigate} from "react-router-dom";
import {accountService} from "../services/accountService";
import {IoIosEye} from "react-icons/io";
import {IoIosEyeOff} from "react-icons/io";


const SignUp = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const {signup, error, isLoading} = useSignup();
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirm, setIsShowConfirm] = useState(false);


    useEffect(() => {
        if (accountService.isLogged()) {
            navigate('/');
            window.location.reload(false);
        }

    }, []);
    const handleSumbit = async (e) => {
        e.preventDefault();

        if (password === confirmPassword) {
            setPasswordError(false)
            await signup(email, username, password);
        } else {
            setPasswordError(true)
        }

        if (accountService.isLogged()) {
            navigate('/')
            window.location.reload(false);
        }

    }

    return (
        <div className={"h-full w-full flex items-center justify-center"}>
            <form onSubmit={handleSumbit}
                  className={"flex flex-col justify-center bg-[#313338] text-white w-[33%] h-[40%] rounded-[8px] p-5 shadow-2xl"}>
                <p className={"text-2xl text-center pb-4"}>Inscrit toi !</p>

                <div className={"grid grid-cols-2 gap-x-4 gap-y-4 my-4"}>
                    <div className={"flex flex-col gap-2"}>
                        <label className={"flex gap-1 text-[#b5bac1] text-[14px]"}>EMAIL <p
                            className={"text-red-500"}>*</p></label>
                        <input
                            className={"input-signup"}
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className={"flex flex-col gap-2"}>
                        <label className={"flex gap-1 text-[#b5bac1] text-[14px]"}>NOM D'UTILISATEUR <p
                            className={"text-red-500"}>*</p></label>
                        <input
                            className={"input-signup"}
                            type="text"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className={"flex flex-col gap-2"}>
                        <label className={"flex gap-1 text-[#b5bac1] text-[14px]"}>MOT DE PASSE <p
                            className={"text-red-500"}>*</p></label>
                        <div className={"flex gap-0.5"}>
                            <input
                                className={"input-signup input-password  w-[85%]"}
                                type={isShowPassword ? "text" : "password"}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type={"button"} onClick={() => setIsShowPassword(!isShowPassword)} className={"flex justify-center items-center bg-[#1e1f22] text-[#dbdee1] p-2 rounded-br-[5px] rounded-tr-[5px] w-[15%]"}>
                                {isShowPassword ?
                                    <IoIosEye/>
                                    :
                                    <IoIosEyeOff/>
                                }
                            </button>
                        </div>
                    </div>
                    <div className={"flex flex-col gap-2"}>
                        <label className={"flex gap-1  text-[#b5bac1] text-[14px]"}>COMFIRMER LE MOT DE PASSE<p
                            className={"text-red-500"}> *</p></label>
                        <div className={"flex gap-0.5"}>
                            <input
                                className={"input-signup input-password w-[85%]"}
                                type={isShowConfirm ? "text" : "password"}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button type={"button"} onClick={() => setIsShowConfirm(!isShowConfirm)} className={"flex justify-center items-center bg-[#1e1f22] text-[#dbdee1] p-2 rounded-br-[5px] rounded-tr-[5px] w-[15%]"}>
                                {isShowConfirm ?
                                    <IoIosEye className={"hover:cursor-pointer"}/>
                                    :
                                    <IoIosEyeOff className={"hover:cursor-pointer"}/>
                                }
                            </button>
                        </div>
                    </div>
                </div>
                <button className={"bg-[#5865f2] hover:bg-[#4752c4] rounded-[5px] h-[40px] mt-2 mb-4"}
                        disabled={isLoading}>M'inscrire
                </button>
                {error && <p className={"text-red-500 text-sm"}>{error}</p>}
                {passwordError &&
                    <p className={"text-red-500 text-sm"}>Il y a une erreur entre les deux mots de passe</p>}
                <Link to={'/login'} className={"text-sm text-[#00a8fc]"}>Tu as déjà un compte ?</Link>
            </form>
        </div>
    )
}

export default SignUp;
import {useEffect, useState} from "react";
import {useLogin} from "../hooks/useLogin";
import {Link, useNavigate} from "react-router-dom";
import {accountService } from "../services/accountService"
import {IoIosEye, IoIosEyeOff} from "react-icons/io";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login, isLoading, error} = useLogin();
    const [isShowPassword, setIsShowPassword] = useState(false);

    useEffect(() => {
        if(accountService.isLogged()){
            navigate('/')
            window.location.reload(false);
        }

    }, []);

    const handleSumbit = async (e) => {
        e.preventDefault();

        await login(email, password)

        if (accountService.isLogged()){
            navigate('/')
            window.location.reload(false);
        }
    }

    return (
        <div className={"h-full w-full flex items-center justify-center"}>
            <form onSubmit={handleSumbit} className={"flex flex-col justify-center bg-[#313338] text-white w-[25%] h-[40%] rounded-[8px] p-5 shadow-2xl"}>
                <p className={"text-2xl text-center pb-4"}>Connecte toi</p>
                <div className={" flex flex-col gap-4 my-4"}>
                    <div className={"flex flex-col gap-2"}>
                        <label className={"flex gap-1 text-[#b5bac1] text-[14px]"}>EMAIL <p className={"text-red-500"}>*</p>
                        </label>
                        <input
                            className={"input-signup"}
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className={"flex flex-col gap-2"}>
                        <label className={"flex gap-1 text-[#b5bac1] text-[14px]"}>MOT DE PASSE <p
                            className={"text-red-500"}>*</p></label>
                        <div className={"flex gap-0.5 w-[100%]"}>
                            <input
                                className={"input-signup input-password w-[90%]"}
                                type={isShowPassword ? "text" : "password"}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type={"button"} onClick={() => setIsShowPassword(!isShowPassword)}
                                    className={"flex justify-center items-center bg-[#1e1f22] text-[#dbdee1] p-2 rounded-br-[5px] rounded-tr-[5px] w-[10%]"}>
                                {isShowPassword ?
                                    <IoIosEye/>
                                    :
                                    <IoIosEyeOff/>
                                }
                            </button>
                        </div>
                    </div>
                </div>
                <button disabled={isLoading}
                        className={"bg-[#5865f2] hover:bg-[#4752c4] rounded-[5px] h-[40px] mt-2 mb-4"}>Connexion
                </button>
                {error && <p className={"text-red-500 text-sm"}>{error}</p>}

                <Link to={'/signup'} className={"text-sm text-[#00a8fc]"}>Pas encore de compte ?</Link>
            </form>
        </div>
    )
}

export default Login;
import {useNavigate} from "react-router-dom";

export const useLogout = () => {
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
        window.location.reload(false);
    }

    return {logout};
}
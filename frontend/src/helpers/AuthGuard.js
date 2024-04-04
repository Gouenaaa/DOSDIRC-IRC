import {Navigate} from "react-router-dom";
import { accountService} from "../services/accountService";

export function AuthGuard({children}) {
    if(!accountService.isLogged()){
        return (<Navigate to={'/login'}/>);
    }
    return children;
}
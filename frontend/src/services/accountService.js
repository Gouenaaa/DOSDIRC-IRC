
const saveToken = (token) => {
    localStorage.setItem('token', token);
}

const isLogged = () => {
    let token = localStorage.getItem('token');
    return !!token;
}

export const accountService = {
    saveToken, isLogged
}
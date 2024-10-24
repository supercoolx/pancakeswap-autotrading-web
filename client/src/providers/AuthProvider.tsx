import { useEffect, useState } from "react";

import AuthContext from "./contexts";
import API from "../utils/api";

const AuthProvider = ({ children }: { children: JSX.Element }) => {

    const [isAuthenticatied, setAuthenticated] = useState(false);

    useEffect(() => {
        API.get('/user/me').then(() => {
            setAuthenticated(true);
        }).catch(console.error);
    }, []);

    const login = (email: string, password: string) => {
        API.post('/auth/login', { email, password }).then(() => {
            setAuthenticated(true);
        }).catch(() => {
            alert('Login failed.');
        });
    }

    const signup = (username: string, email: string, password: string) => {
        API.post('/auth/signup', { username, email, password }).then(() => {
            setAuthenticated(true);
        }).catch(() => {
            alert('Register failed.');
        });
    }

    const logout = () => {
        API.post('/auth/logout').then(res => {
            console.log(res.data);
            setAuthenticated(false);
        }).catch(console.error);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticatied, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
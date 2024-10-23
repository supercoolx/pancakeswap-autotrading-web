import { createContext, useContext, useLayoutEffect, useState, Dispatch, SetStateAction } from "react";
import API from "../utils/api";

const AuthContext = createContext({
    isAuthenticatied: false,
    user: {},
    setAuthenticated: (() => void(0)) as Dispatch<SetStateAction<boolean>>
});

const AuthProvider = ({ children }: { children: JSX.Element }) => {

    const [isAuthenticatied, setAuthenticated] = useState(false);
    const [user, setUser] = useState<object>({});

    useLayoutEffect(() => {
        API.get('/user/me').then((res) => {
            setAuthenticated(true);
            setUser(res.data);
        })
        .catch(console.error);
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticatied, user, setAuthenticated }}>
            { children }
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
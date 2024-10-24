import { createContext, useContext } from "react";

const AuthContext = createContext<AuthContextType>({ isAuthenticatied: false });

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
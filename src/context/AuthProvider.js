/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [OTP, setOTP] = useState();
    const [email, setEmail] = useState();

    return (
        <AuthContext.Provider value={{ auth, setAuth, OTP, setOTP, setEmail, email }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;

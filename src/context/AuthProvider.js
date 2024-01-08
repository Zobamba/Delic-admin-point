import React, { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [email, setEmail] = useState();
    const [theme, setTheme] = useState("light");
    const [notification, setNotification] = useState(null);

    const toggleTheme = () => {
        setTheme((curr) => (curr === "light" ? "dark" : "light"))
    }

    return (
        <AuthContext.Provider value={{
            auth, setAuth,
            email, setEmail,
            theme, toggleTheme,
            notification, setNotification
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;

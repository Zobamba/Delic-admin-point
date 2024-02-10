import React, { createContext, useState } from "react";
import PropTypes from 'prop-types';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [email, setEmail] = useState();
    const [theme, setTheme] = useState("light");
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [notification, setNotification] = useState(null);

    const toggleTheme = () => {
        setTheme((curr) => (curr === "light" ? "dark" : "light"))
    }

    return (
        <AuthContext.Provider value={{
            auth, setAuth,
            email, setEmail,
            theme, toggleTheme,
            menuIsOpen, setMenuIsOpen,
            notification, setNotification
        }}>
            {children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  
export default AuthContext;

import { createContext, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const AppContext = createContext();

const AppProvider = ({children}) => {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        if (!userInfo) {
            <Navigate to="/" />
        }
    }, [])

    return <AppContext.Provider value = {{user, setUser}}>{children}</AppContext.Provider>
};

export const AppState = () => {
    return useContext(AppContext);
};

export default AppProvider;
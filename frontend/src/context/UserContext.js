import { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const UserContext = ({children}) => {
    const [user, setUser] = userState();
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        if (!userInfo) {
            navigate('/');
        }
    }, [navigate])

    return <ChatContext.Provider value = {{user, setUser}}>{children}</ChatContext.Provider>
};

export const userState = () => {
    return useContext(ChatContext);
}

export default UserContext;
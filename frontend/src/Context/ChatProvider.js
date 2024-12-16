import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";


const chatContext = createContext();

const  ChatProvider = ({children})=>{

const [user, setUser] = useState();

const [selectedChat, setSelectedChat] = useState();

const [chats, setChats] = useState([]);

const [notifiction, setNotifiction] = useState([]);

const history = useHistory();

useEffect(() => {
const userInfo =JSON.parse(localStorage.getItem("userInfo"));
setUser(userInfo);

if (!userInfo){
     history.push("/");
 }
}, [history]);




    return (
        <chatContext.Provider value={{user, setUser, selectedChat,setSelectedChat, chats, setChats,notifiction, setNotifiction}}>
            {children}
        </chatContext.Provider>
    );
};

export const ChatState = ()=>{
  return useContext(chatContext);
};

export default ChatProvider;
import { Box } from "@chakra-ui/react";
import { useState } from "react";
import ChatBox from "../components/ChatBox";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChat from "../components/MyChat";
import { ChatState } from "../Context/ChatProvider";

const ChatPage = () => {
const { user } = ChatState();

const [fetchAgain, setFetchAgain] = useState(false);
     
    

  return (
    <div style={{width :"100%"}}>
     {user && <SideDrawer/>}


    <Box   display ="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
    {user && <MyChat fetchAgain={fetchAgain}/>
    }
    {user && ( <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/> )}


    </Box>
  
    </div>
  )
}

export default  ChatPage;
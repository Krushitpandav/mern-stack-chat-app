import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Stack,  useToast , Text} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { getSender } from '../config/ChatLoics1';
import { ChatState } from '../Context/ChatProvider';
import ChatLoding from './ChatLoding';
import GroupChatModel from './miscellaneous/GroupChatModel';

const MyChat = ({fetchAgain}) => {
  
  const [loggedUSer, setLoggedUSer] = useState();
  const { SelectedChat, user , setSelectedChat, chats, setChats} = ChatState();

  const Toast = useToast();

  const fetchChats = async () => {
     console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      console.log(data);
      setChats(data);
    } catch (error) {
      Toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    
  setLoggedUSer(JSON.parse(localStorage.getItem("userInfo")));
  fetchChats();
    
  },[fetchAgain]);
  
  
  return (
    <Box display={{ base: SelectedChat ? "none" : "flex", md: "flex" }}
    flexDir="column"
    alignItems="center"
    p={3}
    bg="white"
    w={{ base: "100%", md: "31%" }}
    borderRadius="lg"
    borderWidth="1px">
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
      My Chats
      {<GroupChatModel>
      <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
          </GroupChatModel>
}
      </Box>
      <Box 
      display={"flex"}
      flexDir="column"
      p={3}
      bg="#F8F8F8"
      w="100%"
      h="100%"
      borderRadius="lg"
      overflowY="hidden"
      >
        {chats ? (
         <Stack overflowY={'scroll'}>
          {
            chats.map((chat)=>(
             <Box
             onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={SelectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={SelectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
             >
            {console.log(chat.users)}
            <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUSer, chat.users )
            : chat.chatName}
                </Text>
             </Box>


            ))  }
        

         </Stack>
        ):(
          <ChatLoding/>
          
        )}

      </Box>
      
    </Box>
  )
}


export default MyChat;
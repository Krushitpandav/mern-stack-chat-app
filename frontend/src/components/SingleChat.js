import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, FormControl, IconButton, Input, keyframes, Spinner, TabIndicator, Text,  useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { getSender,getSenderFull } from '../config/ChatLoics1';
import { ChatState } from '../Context/ChatProvider';
import ProfileModel from './miscellaneous/ProfileModel';
import UpdateGroupChatModel from './miscellaneous/UpdateGroupChatModel';
import ScrollableChat from './ScrollableChat';
import "./style.css";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animation/typing.json";
import EmojiPicker from 'emoji-picker-react';




const ENDPOINT = "http://localhost:5000";
 var socket , selectedChatCompare;

const SingleChat = ({fetchAgain,setFetchAgain}) => {

   const Toast = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };




   const{user, selectedChat , setSelectedChat, notifiction,  setNotifiction} = ChatState();

  

  const fetchMessages = async()=>{
    if (!selectedChat) return;

    try {
      const config ={
        headers:{
          Authorization:`Bearer ${user.token}`,
        }
      };
      const {data } = await axios.get(`/api/message/${selectedChat._id}`,config);

      setMessages(data);
      setLoading(false);

      socket.emit('join chat' , selectedChat._id);

    } catch (error) {
      console.log(error);
      Toast({
        title: "Error Occured!",
        description: "Failed to load the message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

    }
  }

 

   const sendMessage= async (event)=>{
    if(event.key === "Enter" && newMessage){
      socket.emit("stop typing", selectedChat._id);
       try {
          const config ={
            headers:{
              //"content-type":"aplication/json",
              Authorization:`Bearer ${user.token}`,
            }
          };

          setNewMessage("");

          const {data } = await axios.post("/api/message",
          {
            content: newMessage,
            chatId:selectedChat._id,
          },
          config
          );
          socket.emit('new message' ,data);
          setMessages([...messages, data]);
       } catch (error) {
        console.log(error);
        Toast({
          title: "Error Occured!",
          description: "Failed to send the message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });

       }
    }

  
   };

   useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

   const typingHandler=(e)=>{

    setNewMessage(e.target.value);

     // typing Indicator logic
     if(!socketConnected) return;
     if(!typing){
      setTyping(true)
      socket.emit('typing', selectedChat._id);
     }

     let lastTypingTime = new Date().getTime();
     var timerLength = 7000;
     setTimeout(()=>{
    var timeNow = new Date().getTime();
     var timeDiff = timeNow - lastTypingTime;

    if (timeDiff>= timerLength && typing){
      socket.emit('stop typing', selectedChat._id);
      setTyping(false);
    } 

     },timerLength);

  };

  useEffect(() => {
    
  fetchMessages();

  selectedChatCompare = selectedChat;
    
  }, [selectedChat]);


  useEffect(() => {
    
    socket.on("message recieved",(newMessageRecieved)=>{
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
       if(!notifiction.includes(newMessageRecieved)){
        setNotifiction([newMessageRecieved, ...notifiction]);
        setFetchAgain(!fetchAgain);
       }

      }else{
        setMessages([...messages, newMessageRecieved]);
      }
    });
  })
  
  

  return (
    <>{
        selectedChat?(
            <>
             <Text
             fontSize={{ base: "28px", md: "30px" }}
             pb={3}
             px={2}
             w="100%"
             fontFamily="Work sans"
             display="flex"
             justifyContent={{ base: "space-between" }}
             alignItems="center"
             >
               <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
               
            {!selectedChat.isGroupChat ? (
             <>
             {getSender(user,selectedChat.users)}
             <ProfileModel user={getSenderFull(user,selectedChat.users)}/>
             </>
            ):(
              <>{selectedChat.chatName.toUpperCase()}
              
               <UpdateGroupChatModel
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
            
              
              </>
              
            )}

             </Text>
             <Box
              display={'flex'}
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            
            backgroundSize={'cover'}

            
            >

             {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages" >
                <ScrollableChat messages={messages}  />
              </div>
            )}


            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
               {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
                required
                width={820}
              >
                </Input>
                <ArrowBackIcon 
                />
                  

            </FormControl>
             </Box>
            </>
        ):(
            <Box display="flex" alignItems="center" justifyContent="center" h="100%">
            <Text fontSize="3xl" pb={3} fontFamily="Work sans">
              Click on a user to start chatting
            </Text>
          </Box>   
        )
    }</>
  )
  
};

export default SingleChat;
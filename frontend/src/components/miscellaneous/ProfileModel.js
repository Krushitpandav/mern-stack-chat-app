import { ViewIcon } from '@chakra-ui/icons';
import { Button, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure , Image , Text} from '@chakra-ui/react';

import React from 'react'

const ProfileModel = ({user, children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

  return(

 
  <>
  
  {
  children ?(
  <span onClick={onOpen}>{children}</span>
  ):(
    <IconButton 
      display={{base:"flex"}}
      icon={<ViewIcon/>}
      onClick={onOpen}
    />
)}

<Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent height={"410px"}>
          <ModalHeader
          fontSize='30px'
          fontFamily="work sans"
          display="flex"
          justifyContent={"center"}
          >
            {user.name}
            
            </ModalHeader>
          <ModalCloseButton />
          <ModalBody 
           display={"flex"}
           flexDir="column"
           alignItems={"center"}
           justifyContent="space-between"
           >
            <Image
              borderRadius={"full"}
              boxSize="150px"
              src={user.pic}
              alt={user.name}
            />
            <Text 
              fontSize={{base:"28px", md:"30px"}}
              fontFamily="work sans"
            >
            {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>

          </ModalFooter>
        </ModalContent>
      </Modal>



  </>
  )  
};

export default ProfileModel;
import React, { useEffect, useState } from 'react';
import { AppState } from '../context/AppProvider';
import SideBar from '../components/SideBar';
import Chats from '../components/Chats';
import ChatBox from '../components/ChatBox';

const Chat = () => {
  const {user} = AppState();
  console.log(user)
    
    return (
    <div>
      {user && <SideBar/>}
      {user && <Chats/>}
      {user && <ChatBox/>}
    </div>
  )
}

export default Chat;

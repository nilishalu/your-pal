import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Chat = () => {
  const [chats, setChats] = useState([]);

  const fetchChats = async () => {
    const data = await axios.get("/64bfff4d61f32e63bcad0909/messages");

    setChats(data.data.messages);
  }

  useEffect(() => {
    fetchChats()
  }, [])

  return (
    <div>
      Chats
      {chats.map((chat) => (
        <div key={chat._id}>{chat.sender}</div>
      ))}
    </div>
  )
}

export default Chat;

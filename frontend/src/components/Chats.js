import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from "axios";
import { AppState } from '../context/AppProvider'

const Chats = () => {
  const [currUser, setCurrUser] = useState(null);
  let {user, chats, currChat, setUser, setChats, setCurrChat} = AppState();
  user = user.data;

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      };

      const {data} = await axios.get("/api/chat", config);
      setChats(data);
      console.log("chats", chats)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setCurrUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [])

  const getSender = (currUser, users) => {
    return users[0]._id === currUser.data._id ? users[1].name: users[0].name;
  }

  console.log(currChat)

  return (
    <>
    <div>
      <div>
        <h2>Chats</h2>
        <button>New Group</button>
      </div>
      {chats ? 
        <div>
        {chats.map((chat) => (
           <div key = {chat._id} onClick={() => setCurrChat(chat)}>
            <h4>{!chat.isGroupChat
              ? getSender(currUser, chat.users)
              : chat.chatName}
            </h4>
           </div>
        ))}
        </div>
      : <span>No Chats Yet</span>}
    </div>
    </>
  )
}

export default Chats

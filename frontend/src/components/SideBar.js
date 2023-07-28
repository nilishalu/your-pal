import { useState } from "react"
import { useNavigate } from "react-router-dom";
import React from 'react'
import { AppState } from "../context/AppProvider";
import UserChat from "./UserChat";
import axios from "axios";

const SideBar = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  let { user, chats, setChats, setCurrChat } = AppState();
  user = user.data;
    
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/")
  }

  const handleSearch = async () => {
      if (!search) {
        console.log("Enter somme value!");
        return;
      }

      try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            }
        }

        const {data} = await axios.get(`/api/user?search=${search}`, config);
        setUsers(data);
      } catch (error) {
        console.log("some error", error)
      }
  }

  const chat = async (userId) => {
      try {
        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`,
            }
        }

        const {data} = await axios.post("/api/chat", {userId}, config);
        console.log(data)
        if (!chats.find((c) => c._id === data._id)) {
            setChats([data, ...chats])
        }
        console.log(chats)
        
        setCurrChat(data);
      } catch (error) {
        console.log(error)
      }
  }
  
  return (
    <div>
      <input 
      type="text"
      placeholder="Search Users"
      onChange={(e) => setSearch(e.target.value)}
      /> 
      <button onClick={handleSearch}>Search</button>

      {users.map(user => (
        <UserChat 
        key = {user._id}
        user = {user}
        handler={() => chat(user._id)}
        />
      ))}
      <h2>Talk to Buddy</h2>
      <button>Notification</button>
      <button> {user.name}</button>
      <button >My profile</button>
      <button onClick={logoutHandler}>Log out</button>
    </div>
  )
}

export default SideBar

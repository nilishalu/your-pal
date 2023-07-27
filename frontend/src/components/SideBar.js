import { useState } from "react"
import { useNavigate } from "react-router-dom";
import React from 'react'
import { AppState } from "../context/AppProvider";

const SideBar = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const { user} = AppState();

  const logoutHandler = () => {
    console.log("Heyy")
    localStorage.removeItem("userInfo");
    navigate("/")
  }
  
  return (
    <div>
      <input 
      type="text"
      placeholder="Search Users"
      onChange={(e) => setSearch(e.target.value)}
      /> 
      <h2>Talk to Buddy</h2>
      <button>Notification</button>
      <button> {user.data.name}</button>
      <button >My profile</button>
      <button onClick={logoutHandler}>Log out</button>
    </div>
  )
}

export default SideBar

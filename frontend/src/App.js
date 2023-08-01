import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/login/Login';
import SignUp from './pages/SignUp';
import Chat from "./pages/Chat";

function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path = "/" element = {<Login/>} />
          <Route path = "/login" element = {<Login/>} />
          <Route path = "/signup" element = {<SignUp/>} />
          <Route path = "/chat" element = {<Chat />} />
        </Routes> 
      </div>
    </Router>
  );
}

export default App;

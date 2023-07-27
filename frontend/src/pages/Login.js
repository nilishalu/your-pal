import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useNavigate();

    const onLogin = async (e) => {
        e.preventDefault();

        if (!password || !email) {
            console.log("Enter all the details");
            return;
        }

        try {
            const response = await axios.post("/api/user/login", {
                email,
                password
            });

            if (response.status === 200) {
                console.log("Login successful:", response.data);
            }

            localStorage.setItem("userInfo", JSON.stringify(response))
            history("/chat");

        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={onLogin}>
            <label>Email:</label>
               <input 
               type = "email"
               value = {email}
               placeholder='Enter your email'
               required = "true"
               onChange = {(e) => setEmail(e.target.value)}
               />

               <label>Password:</label>
               <input 
               type = "password"
               value = {password}
               required = "true"
               onChange={(e) => setPassword(e.target.value)}
               />

               <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login;
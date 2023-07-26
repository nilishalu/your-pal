import React, { useState } from 'react';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("/login", {
                email,
                password
            });

            if (response.status === 200) {
                console.log("Login successful:", response.data);
            }

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
               onChange={(e) => setEmail(e.target.value)}
               />

               <label>Password:</label>
               <input 
               type = "password"
               value = {password}
               onChange = {(e) => setPassword(e.target.value)}
               />

               <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login;
import { useState } from 'react';
import axios from 'axios';

function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSignUp = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("/signup", {
                name,
                email,
                password 
            });

            if (response.status == 201) {
                console.log('Signup successful', response.data);
            }

        } catch (error) {
            console.error('Signup error:', error)
        }
    };

    return (
        <div>
            <h2>SignUp</h2>
            <form onSubmit = {onSignUp}>
               <label>Name:</label>
               <input 
               type = "text"
               value = {name}
               onChange = {(e) => setName(e.target.value)}
               />

               <label>Email:</label>
               <input 
               type = "email"
               value = {email}
               onChange = {(e) => setEmail(e.target.value)}
               />

               <label>Password:</label>
               <input 
               type = "password"
               value = {password}
               onChange = {(e) => setPassword(e.target.value)}
               />

               <button type = "submit">SignUp</button>
            </form>
        </div>
    )
}

export default SignUp;
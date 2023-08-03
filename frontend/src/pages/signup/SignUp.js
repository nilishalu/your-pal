import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [picture, setPicture] = useState('');
    const history = useNavigate();

    const postPicture = (pic) => {

    }

    const onSignUp = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            console.log("Please fill all the details");
            return;
        }

        try {

            const response = await axios.post("/api/user/signup", {
                name,
                email,
                password,
            });

            console.log(response)

            if (response.status == 201) {
                console.log('Signup successful', response);
            }

            localStorage.setItem("userInfo", JSON.stringify(response))
            history("/chat");
        } catch (error) {
            console.error('Signup error:', error)
        }
    };

    return (
        <div className='container-login'>
            <h2 className='heading'>SignUp</h2>
            <form onSubmit = {onSignUp}>
               <label className='input-label'>Name:</label>
               <input 
               type = "text"
               value = {name}
               placeholder='Enter your name'
               onChange = {(e) => setName(e.target.value)}
               required = "true"
               />

               <label className='input-label'>Email:</label>
               <input 
               type = "email"
               value = {email}
               placeholder='Enter your email'
               required = "true"
               onChange = {(e) => setEmail(e.target.value)}
               />

               <label className='input-label'>Password:</label>
               <input 
               type = "password"
               value = {password}
               required = "true"
               onChange = {(e) => setPassword(e.target.value)}
               />

              <label className='input-label'>Profile Picture:</label>
               <input 
               type = "file"
               p = {1.8}
               value = {picture}
               onChange = {(e) => postPicture(e.target.files[0])}
               />

               <button type = "submit">SignUp</button>
            </form>
        </div>
    )
}

export default SignUp;
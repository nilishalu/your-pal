import React from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        
        if (userInfo) {
            navigate('/chats');
        }
    }, [navigate]);

  return (
    <div>
      Home
    </div>
  )
}

export default Home

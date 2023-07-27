import React from 'react'
import { useHistory } from 'react-router-dom';

const Home = () => {
    const navigate = useHistory();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        
        if (userInfo) {
            navigate.push('/chats');
        }
    }, [navigate]);

  return (
    <div>
      Home
    </div>
  )
}

export default Home

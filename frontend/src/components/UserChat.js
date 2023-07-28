import React from 'react'

const UserChat = ({user, handler}) => {
  return (
    <div>
     <span onClick={handler} style= {{cursor : "pointer"}}>
       {user.name}<br></br>
       {user.email}
     </span>
    </div>
  )
}

export default UserChat;

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv'); 
const socketIO = require('socket.io');

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");

const User = require('./models/User');
const Message = require('./models/Message');

const app = express();
dotenv.config();

const port = process.env.PORT; 

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (error) => {
  console.log(error)
})
db.once('open', () => {
  console.log("Database connected")
})

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);

const server = app.listen(port, () => {
  console.log('Server running at ' + port);
});

const io = socketIO(server);

const users = {};

async function saveMessage(sender, receivers, text, group = null) {
  try {
    const message = new Message({
      sender,
      receivers,
      message: text,
      group,
    });
    
    await message.save();

    return message;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}

io.on('connection', (socket) => {
  console.log('A user connected with socket id:', socket.id);

  socket.on('authenticate', (userId) => {
    users[userId] = socket.id;
    console.log(`User with ID ${userId} authenticated.`);
  });

  socket.on('private-message', async (data) => {
    try {
      const { sender, receiver, text } = data;

      const message = await saveMessage(sender, [receiver], text);
      
      io.to(users[sender]).emit('new-message', message);
      io.to(users[receiver]).emit('new-message', message);
    } catch (error) {
      console.error('Error sending private message:', error);
    }
  });

  socket.on('group-message', async (data) => {
    try {
      const { sender, groupId, text } = data;

      const group = await Group.findById(groupId);

      if (!group) {
        console.log('Group not found');
        return;
      }

      const message = await saveMessage(sender, group.members, text, groupId);

      group.members.forEach((member) => {
        if (users[member]) {
          io.to(users[member]).emit('new-group-message', message);
        }
      });
    } catch (error) {
      console.error('Error sending group message:', error);
    }
  });

  socket.on('disconnect', () => {
    const userId = Object.keys(users).find((key) => users[key] === socket.id);
    if (userId) {
      delete users[userId];
      console.log(`User with ID ${userId} disconnected.`);
    }
  });
});


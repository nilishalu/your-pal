const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv'); 
const socketIO = require('socket.io');

const User = require('./models/User');
const Message = require('./models/Message');
const Group = require('./models/Group');

const app = express();
dotenv.config();

const port = process.env.PORT; 

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', (error) => {
  console.log(error)
})
db.once('open', () => {
  console.log("Database connected")
})

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "Email has already been registered." });
    }

    const encryptedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      password: encryptedPassword
    });

    await newUser.save();

    res.status(201).json({ message: 'User registerd succesffuly.' });
  } catch (error) {
    res.status(500).json({ message: 'Error occurred while processing your request. Please try again later.' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password} = req.body;

  try {
    const user = await User.findOne( {email} );
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.status(200).json({ message: 'Login Successful.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal error occurred, pleasae try again later.' });
  }
})

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

app.post('/create-group', async (req, res) => {
  try {
    const { name, admin, members } = req.body;

    const [groupAdmin, groupMembers] = await Promise.all([
      User.findById(admin),
      User.find({ _id: { $in: members } }),
    ]);

    if (!groupAdmin || groupMembers.length !== members.length) {
      return res.status(404).json({ message: 'Admin or members not found.' });
    }

    const newGroup = new Group({ name, admin, members });
    await newGroup.save();

    members.forEach((member) => {
      if (users[member]) {
        io.to(users[member]).emit('new-group', newGroup);
      }
    });

    res.json({ message: 'Group created successfully.', group: newGroup });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while creating the group.' });
  }
});

app.post('/send-group-message', async (req, res) => {
  try {
    const { sender, groupId, text } = req.body;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }

    const message = await saveMessage(sender, group.members, text, groupId);
    
    group.members.forEach((member) => {
      if (users[member]) {
        io.to(users[member]).emit('new-group-message', message);
      }
    });

    res.json({ message: 'Message sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while sending the message.' });
  }
});

app.get('/group-messages/:groupId', async (req, res) => {
  try {
    console.log(req)
    const { groupId } = req.params;

    const message = await Message.find({
      group: groupId
    })

    res.json({ message });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' })
  }
})


app.get('/:userId/messages', async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({ receivers: userId }).sort({ createdAt: 1 });

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching received messages.' });
  }
});

app.post('/chat/:senderId/:receiverId', async (req, res) => {
  try {
    const { sender, receiver, text } = req.body;

    const [messageSender, messageReceiver] = await Promise.all([
      User.findById(sender),
      User.findById(receiver),
    ]);

    if (!messageSender || !messageReceiver) {
      return res.status(404).json({ message: 'Sender or receiver not found.' });
    }

    const message = await saveMessage(sender, [receiver], text);

    io.to(sender).emit('new-message', message);
    io.to(receiver).emit('new-message', message);

    res.json({ message: 'Message sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while sending the message.' });
  }
});

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv'); 
const socketIO = require('socket.io');

const User = require('./models/User');
const Message = require('./models/Message');

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

io.on('connection', (socket) => {
  console.log('Connection established by a user');

  socket.on('private-message', async (data) => {
    try {
      const { sender, receiver, message } = data;

      console.log(sender)

      const senderId = new mongoose.Types.ObjectId(sender);
      const receiverId = new mongoose.Types.ObjectId(receiver);

      const [senderInfo, receiverInfo] = await Promise.all([
        User.findById(senderId),
        User.findById(receiverId)
      ])

      console.log(senderInfo, receiverInfo)

      if (!senderInfo || !receiverInfo) {
        return socket.emit('message error', { message: 'Sender or receiver not found.' });
      }

      const mes = new Message({
        sender,
        receiver,
        message
      })

      await mes.save();

      socket.emit('new-private-message', mes);
      socket.to(receiverInfo).emit('new-private-message', mes);

    } catch (error) {
      console.log(error)
      socket.emit('private-message-error', { message: 'Error occurred while proccessing your request.' });
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected.');
  });

  app.post('/chat', async (req, res) => {
    try {
      const { senderId, receiverId } = req.params;
      const messages = await Message.find({
        $or: [
          { sender: senderId, receiver: receiverId },
          { sender: receiverId, receiver: senderId }
        ]
      }).sort('timestamp');

      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while fetching messages' });
    }
  })
})


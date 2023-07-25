const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv'); 

const User = require('./models/User');

const app = express();
dotenv.config();

const port = process.env.PORT; 

app.use(express.json());

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

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true
})
const db = mongoose.connection
db.on('error', (error) => {
  console.log(error)
})
db.once('open', () => {
  console.log("Database connected")
})

app.listen(port, () => {
  console.log('Server running at ' + port);
});


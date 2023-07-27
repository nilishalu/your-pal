const bcrypt = require('bcrypt');
const User = require("../models/User");
const generateJWTToken = require("../config/generateJWTToken");

const registerUser = async (req, res) => {
    const { name, email, password, picture } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all the fields");
    }

    console.log(req.body)

    try {
      const userExists = await User.findOne({ email });
  
      if (userExists) {
        return res.status(400).json({ message: "Email has already been registered." });
      }
      console.log(userExists)
  
      const encryptedPassword = await bcrypt.hash(password, 12);
  
      console.log(encryptedPassword)
      const newUser = new User({
        name,
        email,
        password: encryptedPassword,
        picture
      });
  
      await newUser.save();
  
      console.log(newUser)
      res.status(201).json({
        message: 'User registerd succesffuly.',
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        picture: newUser.picture,
        token: generateJWTToken(newUser._id)
      });
    } catch (error) {
      res.status(500).json({ message: 'Error occurred while processing your request. Please try again later.' });
    }
}

const authUser = async (req, res) => {
    const { email, password} = req.body;
    
    try {
        const user = await User.findOne( {email} );
        if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password.' });
        }
    
        res.status(200).json({ 
            message: 'Login Successful.',
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            token: generateJWTToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal error occurred, pleasae try again later.' });
    }
    
};

const getAllUsers = async (req, res) => {
    const key = req.query.search;
    let userKey;
    if (key) {
       userKey = {
        $or: [
          { name: { $regex: key, $options: "i" }},
          { email: { $regex: key, $options: "i"} }
        ]
       }
    }
    else {
      userKey = {};
    }

    const users = await User.find(userKey).find({ _id: {$ne: req.user._id} });
    res.send(users);
};

module.exports = { registerUser, authUser, getAllUsers }
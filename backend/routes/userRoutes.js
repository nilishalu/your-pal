const express = require('express');
const { registerUser, authUser } = require("../controllers/userController");

const router = express.Router();

router.post('/login', authUser);

router.post('/signup', registerUser);

module.exports = router;
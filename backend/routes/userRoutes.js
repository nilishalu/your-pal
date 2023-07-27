const express = require('express');
const { registerUser, authUser, getAllUsers } = require("../controllers/userController");
const { author } = require("../authorization/authUser");

const router = express.Router();

router.post('/login', authUser);
router.post('/signup', registerUser);
router.route("/").get(author, getAllUsers);

module.exports = router;
const express = require("express");
const { author } = require("../authorization/authUser");
const { chat, fetchChats } = require("../controllers/chatController");

const router = express.Router();

router.route('/').post(author, chat);
router.route('/').get(author, fetchChats);

module.exports = router;
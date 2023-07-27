const express = require("express");
const { author } = require("../authorization/authUser");
const { chat, fetchChats, createGroup, renameGroup, addMember, removeMember } = require("../controllers/chatController");

const router = express.Router();

router.route('/').post(author, chat);
router.route('/').get(author, fetchChats);
router.route('/group').post(author, createGroup);
router.route('/rename').put(author, renameGroup);
router.route('/group_remove').put(author, removeMember);
router.route('/group_add').put(author, addMember);

module.exports = router;
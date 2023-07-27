const express = require('express');
const { registerUser, authUser, getAllUsers } = require("../controllers/userController");

const router = express.Router();

router.post('/login', authUser);
router.post('/signup', registerUser);
router.get("/", getAllUsers);

module.exports = router;
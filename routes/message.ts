const { addMessage, getMessages } = require("../controller/messageController");
const router1 = require("express").Router();
// Import the Express router module
// Create the routes for the various user actions
router1.post("/addmsg/", addMessage);
router1.post("/getmsg/", getMessages);

module.exports = router1;
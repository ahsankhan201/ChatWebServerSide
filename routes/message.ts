const { addMessage, getMessages,addFile,deleteAllMessages } = require("../controller/messageController");
const router1 = require("express").Router();
var upload=require("../middleware/pictureMiddleware");
router1.post ("/addmsg/",addMessage);
router1.post("/getmsg/", getMessages);
router1.post("/addfile/", upload.single('file'),addFile);
router1.delete("/deleteall/",deleteAllMessages);

module.exports = router1;
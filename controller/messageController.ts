// Import the Message model
const Messages = require("../models/messageModel");

// Define an asynchronous function named `getMessages` that takes three parameters
// `req`, `res`, and `next`
module.exports.getMessages = async (req: any, res: any, next: any) => {
  try {
    const { from, to } = req.body;
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg: any) => {
   
      if (msg.image) {
        return {
          fromSelf: msg.sender.toString() === from,
          image: msg.image,
        };
      } else {
        return {
          fromSelf: msg.sender.toString() === from,
          message: msg.message.text,
        };
      }
    });

    res.json(projectedMessages);
  } catch (ex: any) {
    next(ex);
  }
};

module.exports.addMessage = async (req: any, res: any, next: any) => {
  try {
    const { from, to, message } = req.body;

    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex: any) {
    next(ex);
  }
};

module.exports.addFile = async (req: any, res: any, next: any) => {
  try {
    const { from, to } = req.body;
    const userFile = req.file.filename;
    console.log(req.body);
    console.log(req.file.filename);

    const data = await Messages.create({
      users: [from, to],
      sender: from,
      image: userFile,
    });

    if (data) return res.json({ msg: "Success", image: data.image });
    // else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex: any) {
    next(ex);
  }
};


// delet all messages
module.exports.deleteAllMessages = async (req: any, res: any, next: any) => {
  try {
    const data = await Messages.deleteMany({});
    if (data) return res.json({ msg: "All messages deleted successfully." });
    else return res.json({ msg: "Failed to delete all messages" });
  } catch (ex: any) {
    next(ex);
  }
};
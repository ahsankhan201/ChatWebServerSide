const Messages = require("../models/messageModel");

module.exports.getMessages = async (req: any, res: any, next: any) => {
  try {
    const { from, to } = req.body;
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg: any) => {
      console.log("msg",msg)
        return {
          fromSelf: msg.sender.toString() === from,
          image: msg.image,
          message: msg.message.text,
        };
    });

    res.json(projectedMessages);
  } catch (ex: any) {
    next(ex);
  }
};

module.exports.addMessage = async (req: any, res: any, next: any) => {
  try {
    const userFile = req?.file? req?.file?.filename : null;
    const { from, to, message } = req.body;

    const data = await Messages.create({
      message: { text: message },
      image: userFile,
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
    console.log('user body',req.body)
    const { from, to,message } = req.body;
    const userFile = req.file?.filename;
    console.log(message);

    const data = await Messages.create({
      users: [from, to],
      sender: from,
      image: userFile,
      message: { text: message },
    });
    console.log('data of post',data)

    if (data) return res.json({ msg: "Success",image:data.image,message:data.message.text });
  } catch (ex: any) {
    next(ex);
  }
};

module.exports.deleteAllMessages = async (req: any, res: any, next: any) => {
  try {
    const data = await Messages.deleteMany({});
    if (data) return res.json({ msg: "All messages deleted successfully." });
    else return res.json({ msg: "Failed to delete all messages" });
  } catch (ex: any) {
    next(ex);
  }
};

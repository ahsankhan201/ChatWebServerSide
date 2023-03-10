// Import the Message model
const Messages = require("../models/messageModel");

// Define an asynchronous function named `getMessages` that takes three parameters
// `req`, `res`, and `next`
module.exports.getMessages = async (req:any, res:any, next:any) => {
  try {
    // Destructure the `from` and `to` properties from the request body
    const { from, to } = req.body;

    // Find all messages that were exchanged between the two users specified
    // in the request body. Use the `$all` operator to filter messages that
    // contain both users in their `users` array field.
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    })
    // Sort the retrieved messages by their `updatedAt` field in ascending order
    .sort({ updatedAt: 1 });

    // Map over the `messages` array to create a new array of objects that only
    // contain the necessary information for the client. Each new object has two
    // properties: `fromSelf` which indicates if the message was sent by the same
    // user who made the request, and `message` which contains the text of the message.
    const projectedMessages = messages.map((msg:any) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });

    // Send the projected messages back to the client as a JSON response
    // using the `res.json()` method
    res.json(projectedMessages);
  } catch (ex:any) {
    // If an exception occurs during the execution of the function, pass the
    // error to the `next()` middleware function to handle the error.
    next(ex);
  }
};


// Define an asynchronous function named `addMessage` that takes three parameters
// `req`, `res`, and `next`
module.exports.addMessage = async (req:any, res:any, next:any) => {
  try {
    // Destructure the `from`, `to`, and `message` properties from the request body
    const { from, to, message } = req.body;

    // Create a new document in the `Messages` collection with the following properties:
    // - `message`: an object that contains a `text` property with the value of the `message`
    //   property in the request body.
    // - `users`: an array that contains `from` and `to`.
    // - `sender`: the value of the `from` property in the request body.
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    // If the document is created successfully, send a JSON response back to the client
    // indicating that the message was added successfully. Otherwise, send a response
    // indicating that the message was not added to the database.
    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex:any) {
    // If an exception occurs during the execution of the function, pass the
    // error to the `next()` middleware function to handle the error.
    next(ex);
  }
};

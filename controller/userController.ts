// Import the User model from userModel and the bcrypt library
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

// Define the login function
module.exports.login = async (req: { body: { username: any; password: any; }; }, res:any) => {
  try {
    // Get the username and password from the request body
    const { username, password } = req?.body;
    
    // Find the user with the given username in the database
    const user = await User.findOne({ username });
    
    // If no user is found, return an error message
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    
    // Compare the provided password with the stored password using bcrypt
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    
    // If the passwords don't match, return an error message
    if (!isPasswordMatched)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    
    // If the login is successful, return the user object and a status of true
    return res.json({ status: true, user });
  } catch (ex) {
    // If an exception is thrown, return an error object
    return res.json({ error: ex });
  }
};


// Define the register function
module.exports.register = async (req: { body: { username: any; email: any; password: any; }; }, res:any) => {
  try {
    // Get the username, email, and password from the request body
    const { username, email, password } = req.body;
    
    // Check if the username is already in use
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res
        .status(409)
        .json({ msg: "Username already used", status: false });
    
    // Check if the email is already in use
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.status(409).json({ msg: "Email already used", status: false });
    
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new user with the hashed password and the provided email and username
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    
    // If the user is created successfully, return a status of true and the user object
    return res.status(201).json({ status: true, user });
  } catch (ex) {
    // If an exception is thrown, return an error object
    return res.status(500).json({ error: ex });
  }
};

// Define the getAllUsers function
module.exports.getAllUsers = async (req: { params: { id: any; }; }, res:any) => {
  try {
    // Find all users except the one with the specified id
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);

    // If the users are retrieved successfully, return a status of 201 and the users object
    return res.status(201).json(users);
  } catch (ex) {
    // If an exception is thrown, return an error object
    return res.status(500).json({ error: ex });
  }
};




// Function to set the user avatar
module.exports.setAvatar = async (req:any, res:any) => {
  try {
    // Extract the user id and avatar image from the request object
    const userId = req.params.id;
    const avatarImage = req.body.image;
    
    // Update the user record with the new avatar image
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    
    // Return a response indicating the image was set successfully
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    // If an error occurs, return an error response
    res.status(500).json({ error: ex });
  }
};

// Function to log out a user
module.exports.logOut = (req:any, res:any) => {
  try {
    // Check that the user id is provided
    if (!req.params.id) return res.json({ msg: "User id is required " });
    
    // Remove the user from the onlineUsers set
    onlineUsers.delete(req.params.id);
    
    // Return a response indicating the user was logged out successfully
    console.log("User logged out successfully");
    return res.status(200).send("User logged out successfully");
  } catch (ex) {
    // If an error occurs, return an error response
    res.status(500).json({ error: ex });
  }
};

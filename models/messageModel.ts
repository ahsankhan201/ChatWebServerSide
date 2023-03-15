const mongo = require("mongoose");

const MessageSchema = mongo.Schema(
  {
    message: {
      text: { type: String, required: false },
    },
    users: Array,
    sender: {
      type: mongo.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image:{
      type: String,
      required: false
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongo.model("Messages", MessageSchema);
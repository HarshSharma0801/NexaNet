import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    ChatName: {
      type: String,
    },
    ChatType: {
      type: String,
    },
    Participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    Admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    LastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timeStamp: true,
  }
);

const Chat = mongoose.model("Chat", ChatSchema);

export default Chat;

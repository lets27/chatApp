import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recieverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: { type: String },
    text: { type: String },
  },
  {
    timestamps: true, // 👈 this line adds createdAt and updatedAt
  }
);

// create the model
const Message = mongoose.model("Message", messageSchema);
export default Message;

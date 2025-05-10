import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true, minlength: 6 },
  email: { type: String, required: true, unique: true },
  profilePic: { type: String },
  filename: { type: String },
});

// create the model
const User = mongoose.model("User", userSchema);
export default User;

import Message from "../database/Models/messageModel.js";
import User from "../database/Models/userModel.js";
import multer from "multer";
import cloudinary from "cloudinary";
import { getRecieverSocketId, io } from "../socket/socket.js";
import mongoose from "mongoose";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const APIKEY = process.env.APIKEY;
const foldername = process.env.foldername;
const cloudname = process.env.cloudname;
const APISECRET = process.env.APISECRET;

cloudinary.config({
  cloud_name: cloudname,
  api_key: APIKEY,
  api_secret: APISECRET,
});

const allUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    if (!currentUserId) {
      return res.status.json("unauthorized access");
    }
    const filteredUsers = await User.find({
      _id: { $ne: currentUserId },
    }).select("-password");
    return res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const currentUserId = req.user.id;
    if (!currentUserId) {
      return res.status(404).json("unauthorized access");
    }
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, recieverId: userToChatId },
        { senderId: userToChatId, recieverId: currentUserId },
      ],
    });
    console.log("messages:", messages);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const sendMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      return res.status(403).json({ error: "Please login" });
    }

    const findReceiver = await User.findById(id);
    if (!findReceiver) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    let imageUrl = null;

    if (req.file) {
      const fileType = req.file.mimetype;
      if (!["image/jpeg", "image/png"].includes(fileType)) {
        return res.status(400).json({ error: "Invalid file type." });
      }

      console.log("file", req.file);

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { folder: foldername },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    const newMessage = {
      senderId: currentUserId,
      recieverId: id,
      text: req.body.message,
      image: imageUrl, // imageUrl will be null if no file uploaded
    };

    const messageSend = await Message.create(newMessage);
    console.log("messageSend", messageSend);

    const senderSocketId = getRecieverSocketId(newMessage.senderId);
    const receiverSocketId = getRecieverSocketId(newMessage.recieverId);

    if (senderSocketId) {
      io.to(senderSocketId).emit("latestMessage", newMessage);
    }

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("latestMessage", newMessage);
    }

    return res.status(201).json({ message: messageSend });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    console.log("file", req.file);
    const id = req.user.id;
    console.log("user:", req.user);
    // Validate postId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    // Find the user
    const user = await User.findById(id).select("profilePic filename email");

    if (!user) {
      return res.status(404).json({ error: "user not found." });
    }

    // Prepare update data
    const updateData = {};

    // Handle file upload
    if (req.file) {
      // Validate file type
      const fileType = req.file.mimetype;
      if (!["image/jpeg", "image/png"].includes(fileType)) {
        return res.status(400).json({ error: "Invalid file type." });
      }

      // Delete old image from Cloudinary if it exists
      if (user.filename) {
        try {
          await cloudinary.uploader.destroy(user.filename);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }

      // Upload new image to Cloudinary
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: foldername || "avatars" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });

        updateData.profilePic = uploadResult.secure_url;
        updateData.filename = uploadResult.public_id;
      } catch (uploadError) {
        return res.status(500).json({ error: "Image upload failed." });
      }
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      // Add this:
      select: "profilePic filename username email createdAt",
    });

    console.log("updatedUser", updatedUser);
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updatePost:", error);
    return res.status(500).json({ error: "Error updating user." });
  }
};

export { allUsers, getMessages, sendMessages, updateProfilePicture, upload };

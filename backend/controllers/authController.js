import User from "../database/Models/userModel.js";
import bcrypt from "bcryptjs";
import "dotenv/config";
import pkg from "jsonwebtoken";
const { sign, verify } = pkg;
import multer from "multer";
import cloudinary from "cloudinary";
const secretKey = process.env.JWTSECRET;
import mongoose from "mongoose";
//pass user object directly to decoded
import { decode } from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

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

const signUp = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const { email, username, password } = req.body;
  console.log("body:", req.body);
  console.log(req.file);
  try {
    if (!email || !username || !password || !req.file) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        error: "Please provide email, username, password, and image.",
      });
    }

    // Validate image type
    const fileType = req.file.mimetype;
    if (!["image/jpeg", "image/png"].includes(fileType)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "Invalid file type." });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      await session.abortTransaction();
      session.endSession();
      console.log("user already exists");
      return res
        .status(409)
        .json({ error: "User with this email already exists." });
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { folder: foldername }, // Change folder name if needed
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    if (!uploadResult || !uploadResult.secure_url) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({ error: "Image upload failed." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create(
      [
        {
          email,
          username,
          password: hashedPassword,
          profilePic: uploadResult.secure_url,
          filename: uploadResult.public_id,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser[0] });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    console.error("Signup Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res, next) => {
  const formData = { password: req.body.password, email: req.body.email };

  const userObject = await User.findOne({ email: formData.email });
  // console.log("user:", userObject);

  if (!userObject) {
    return res.status(404).json("user not found");
  }

  //check passwords match
  const isPasswordMatch = await bcrypt.compare(
    formData.password,
    userObject.password
  );

  if (!isPasswordMatch) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const tokenPayload = {
    id: userObject._id,
    username: userObject.username,
    profilePic: userObject.profilePic,
    filename: userObject.filename,
  };

  sign(tokenPayload, secretKey, (err, token) => {
    if (err) return res.status(500).json("failed to generate token");

    const decoded = decode(token); // decode manually
    console.log("Decoded right after signing:", decoded);

    return res.status(200).json({ token, user: userObject });
  });
};

const singleUser = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("myuser:", req.user);
    console.log("userId", userId);
    if (!userId) {
      console.warn("No user ID found in request.");
      return res
        .status(401)
        .json({ error: "Unauthorized. No user ID provided." });
    }

    const user = await User.findById(userId);

    if (!user) {
      console.warn("User not found for ID:", userId);
      return res.status(404).json({ error: "User not found." });
    }

    console.log("User found:", user.username);
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in singleUser:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export { signUp, login, upload, singleUser };

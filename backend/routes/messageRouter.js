import { Router } from "express";
import { verifyToken } from "../controllers/utils.js";
import {
  allUsers,
  getMessages,
  sendMessages,
  updateProfilePicture,
  upload,
} from "../controllers/messageControllers.js";
import { singleUser } from "../controllers/authController.js";

const messageRouter = Router();
messageRouter.use(verifyToken);
messageRouter.get("/user", singleUser);
messageRouter.get("/", allUsers);
messageRouter.get("/:id", getMessages);
messageRouter.post("/message/:id", upload.single("file"), sendMessages);
messageRouter.put("/", upload.single("file"), updateProfilePicture);

export default messageRouter;

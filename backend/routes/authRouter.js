import { Router } from "express";
import { signUp, login, upload } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/signup", upload.single("file"), signUp);
authRouter.post("/login", login);

export default authRouter;

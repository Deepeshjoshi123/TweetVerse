import express from "express";
import { getMe, LogIn, LogOut, SignUp } from "../controller/auth.controller.js";
import { ProtectRoute } from "../middleware/protectRoute.js";

const AuthRouter = express.Router();

AuthRouter.get("/me", ProtectRoute, getMe);

AuthRouter.post("/signup", SignUp);

AuthRouter.post("/login", LogIn);

AuthRouter.post("/logout", LogOut);

export default AuthRouter;

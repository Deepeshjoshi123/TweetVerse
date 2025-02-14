import express from "express";
import { ProtectRoute } from "../middleware/protectRoute.js";
import {
  followUnfollowUser,
  getSuggestedUsers,
  getUserProfile,
  UpdateUserProfile,
} from "../controller/user.controller.js";

const UserRouter = express.Router();

UserRouter.get("/profile/:username", ProtectRoute, getUserProfile);
UserRouter.get("/suggested", ProtectRoute, getSuggestedUsers);
UserRouter.post("/follow/:id", ProtectRoute, followUnfollowUser);
UserRouter.post("/update", ProtectRoute, UpdateUserProfile);

export default UserRouter;

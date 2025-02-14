import express from "express";
import { ProtectRoute } from "../middleware/protectRoute.js";
import {
  commentPosts,
  createPosts,
  deletePosts,
  getAllPosts,
  getFollowingPosts,
  getLikedPosts,
  getUserPosts,
  likeUnlikePosts,
} from "../controller/posts.controller.js";

const PostRouter = express.Router();

PostRouter.get("/all", ProtectRoute, getAllPosts);
PostRouter.get("/likes/:id", ProtectRoute, getLikedPosts);
PostRouter.get("/following", ProtectRoute, getFollowingPosts);
PostRouter.get("/userPosts/:username", ProtectRoute, getUserPosts);

PostRouter.post("/create", ProtectRoute, createPosts);
PostRouter.post("/like/:id", ProtectRoute, likeUnlikePosts);
PostRouter.post("/comment/:id", ProtectRoute, commentPosts);

PostRouter.delete("/:id", ProtectRoute, deletePosts);

export default PostRouter;

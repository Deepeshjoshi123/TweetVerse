import notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/User.Model.js";
import { v2 as cloudinary } from "cloudinary";

export const createPosts = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!text && !img) {
      return res.status(400).json({ error: "Post must have text or image" });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in createPost controller: ", error);
  }
};

export const likeUnlikePosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    const userLikePost = post.likes.includes(userId);

    if (userLikePost) {
      // Unlike the post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      const updateLike = post.likes.filter((id) => {
        id.toString() !== userId.toString();
      });

      return res.status(200).json(updateLike);
    } else {
      //Like the post
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();

      const newNotification = new notification({
        from: userId,
        to: post.user,
        type: "like",
      });

      await newNotification.save();

      const updateLike = post.likes;

      return res.status(200).json(updateLike);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in likeUnlikePost controller: ", error);
  }
};

export const commentPosts = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({
        error: "Text field is required",
      });
    }
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }
    const comment = { user: userId, text };
    post.comments.push(comment);
    await post.save();

    return res.status(200).json(post);
  } catch (error) {
    console.log(`Error in commentPosts : ${error.message}`);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const deletePosts = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    if (req.user._id.toString() !== post.user._id.toString()) {
      return res.status(403).json({
        error: "You are not authorized to delete the posts",
      });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    await Post.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Posts deleted Successfully",
    });
  } catch (error) {
    console.log(`Error in deletePosts ${error.message}`);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate([
        { path: "user", select: "-password" },
        { path: "comments.user", select: "-password" },
      ]);

    return res.status(200).json(posts);
  } catch (error) {
    console.error(`Error in getAllPosts: ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getLikedPosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const likedPost = await Post.find({
      _id: { $in: user.likedPosts },
    }).populate([
      { path: "user", select: "-password" },
      { path: "comments.user", select: "-password" },
    ]);

    return res.status(200).json(likedPost);
  } catch (error) {
    console.log(`Error in getLikedPosts : ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const postsFeed = await Post.find({ user: { $in: user.following } })
      .sort({ createdAt: -1 })
      .populate([
        {
          path: "user",
          select: "-password",
        },
        {
          path: "comments.user",
          select: "-password",
        },
      ]);

    return res.status(200).json(postsFeed);
  } catch (error) {
    console.log(`Error in getFollowingPosts : ${error.message}`);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate([
        { path: "user", select: "-password" },
        { path: "comments.user", select: "-password" },
      ]);

    return res.status(200).json(posts); // ✅ Return posts in response
  } catch (error) {
    console.error(`Error in getUserPosts: ${error.message}`); // ✅ Corrected error log
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

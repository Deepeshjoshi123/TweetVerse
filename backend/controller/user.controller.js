import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

import notification from "../models/notification.model.js";
import User from "../models/User.Model.js";

export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(`Error in getUserProfile ${error.message}`);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const toModifyUser = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res.status(400).json({
        error: "User Cannot Follw Itself",
      });
    }

    if (!toModifyUser || !currentUser) {
      return res.status(404).json({
        error: "User Not Found",
      });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      return res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      const newNotification = new notification({
        type: "follow",
        to: toModifyUser._id,
        from: req.user._id,
      });
      await newNotification.save();
      return res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log(`Error in followUnfollowUser : ${error.message}`);
    return res.status(500).json({
      error: "Internal Server error",
    });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const userFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: {
            $ne: userId,
          },
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUser = users.filter(
      (user) => !userFollowedByMe.following.includes(user._id)
    );
    const suggestedUser = filteredUser.slice(0, 4);

    res.status(200).json(suggestedUser);
  } catch (error) {
    console.log(`Error in the getSuggestedUser :  ${error.message}`);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const UpdateUserProfile = async (req, res) => {
  const {
    fullname,
    email,
    username,
    currentPassword,
    newPassword,
    bio,
    links,
  } = req.body;
  let { profileImg, coverImg } = req.body;

  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      (newPassword && !currentPassword) ||
      (!newPassword && currentPassword)
    ) {
      return res
        .status(400)
        .json({ error: "Provide both current and new password" });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res.status(400).json({ error: "Current password is incorrect" });
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(profileImg, {
        folder: "users",
        transformation: [{ width: 500, height: 500, crop: "limit" }],
      });

      user.profileImg = uploadedResponse.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(coverImg, {
        folder: "users",
        transformation: [{ width: 1200, height: 400, crop: "limit" }],
      });

      user.coverImg = uploadedResponse.secure_url;
    }
    user.fullname = fullname || user.fullname;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.links = links || user.links;

    user = await user.save();
    user.password = undefined;

    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in UpdateUserProfile:", error.message);
    res.status(500).json({ error: error.message });
  }
};

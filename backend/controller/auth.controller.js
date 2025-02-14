import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/User.Model.js";
import bcrypt from "bcryptjs";

export const SignUp = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        error: "Username already exist",
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        error: "Email already exist",
      });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password length must by at least 6 character long" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = new User({
      fullname,
      username,
      email,
      password: hashPassword,
    });

    if (user) {
      generateTokenAndSetCookie(user._id, res);
      await user.save();
      res.status(201).json({
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        followers: user.followers,
        following: user.following,
        profileImg: user.profileImg,
        coverImg: user.coverImg,
      });
    } else {
      return res.ststus(400).json({
        error: "Invalid User Data",
      });
    }
  } catch (error) {
    console.log(`Error in SignUp controller ${error.message}`);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const LogIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const isPasswordValid = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordValid) {
      return res.status(400).json({
        error: "Invalid username or password",
      });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    console.log(`Error in LogIn ${error.message}`);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const LogOut = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({
      message: "User logged out Successfully",
    });
  } catch (error) {
    console.log(`Error in LogOut ${error.message}`);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log(`Error in getMe ${error.message}`);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

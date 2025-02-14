import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import PostRouter from "./routes/post.route.js";
import AuthRouter from "./routes/auth.route.js";
import UserRouter from "./routes/user.route.js";
import { connectToDb } from "./db/connectDb.js";
import NotificationRouter from "./routes/notification.route.js";

const app = express();
dotenv.config({ path: "../.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", AuthRouter);
app.use("/api/users", UserRouter);
app.use("/api/posts", PostRouter);
app.use("/api/notification", NotificationRouter);

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.listen(8000, (req, res) => {
  console.log("App is listening at port 8000");
  connectToDb();
});

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import { fileURLToPath } from "url";

import PostRouter from "./routes/post.route.js";
import AuthRouter from "./routes/auth.route.js";
import UserRouter from "./routes/user.route.js";
import { connectToDb } from "./db/connectDb.js";
import NotificationRouter from "./routes/notification.route.js";

const app = express();
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", AuthRouter);
app.use("/api/users", UserRouter);
app.use("/api/posts", PostRouter);
app.use("/api/notification", NotificationRouter);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  console.log("Serving frontend from:", frontendPath); // Debug log

  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ message: "API route not found" });
    }
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

app.listen(8000, (req, res) => {
  console.log("App is listening at port 8000");
  connectToDb();
});

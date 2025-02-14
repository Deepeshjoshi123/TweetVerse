import express from "express";
import { ProtectRoute } from "../middleware/protectRoute.js";
import {
  deleteNotification,
  getNotification,
} from "../controller/notification.controller.js";

const NotificationRouter = express.Router();

NotificationRouter.get("/", ProtectRoute, getNotification);
NotificationRouter.delete("/", ProtectRoute, deleteNotification);

export default NotificationRouter;

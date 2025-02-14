import notification from "../models/notification.model.js";

export const getNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const Notification = await notification.find({ to: userId }).populate({
      path: "from",
      select: "username profileImg",
    });
    await notification.updateMany({ to: userId }, { read: true });
    return res.status(200).json(Notification);
  } catch (error) {
    console.log(`Error in getNotification Rout : ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    await notification.deleteMany({ to: userId });
    res.status(200).json({ message: "Notification Deleted" });
  } catch (error) {
    console.log(`Error in deleteNotification : ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

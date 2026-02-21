import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/env.js ";
import User from "../models/userModel";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findOne(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

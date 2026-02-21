import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/env.js ";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    console.log(token);

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/env.js ";

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log(authHeader);

    // Authorization header check
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    // extract
    const token = authHeader.split(" ")[1];
    console.log(token);

    // verify

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded);

    // 4️⃣ Attach user info to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    console.log(req.user);

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Not authorized, token invalid",
    });
  }

};


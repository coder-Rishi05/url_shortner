import { Router } from "express";

import {
  signUp,
  login,
  logout,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/signup", signUp);

authRouter.post("/login", login);

authRouter.post("/logout", logout);

authRouter.get("/me", protect, getCurrentUser);

export default authRouter;

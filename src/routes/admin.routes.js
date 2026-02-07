import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

import {
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  getAdminStats,
} from "../controllers/admin.controller.js";

const adminRouter = express.Router();

// All routes below are ADMIN only
adminRouter.use(protect, isAdmin);

// Users
adminRouter.get("/users", getAllUsers);
adminRouter.patch("/users/:id/status", updateUserStatus);
adminRouter.patch("/users/:id/role", updateUserRole);

// Stats
adminRouter.get("/stats", getAdminStats);

export default adminRouter;

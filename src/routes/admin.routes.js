import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

import {
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  getAdminStats,
  updateUserCredits,
} from "../controllers/admin.controller.js";

const adminRouter = express.Router();

// All routes below are ADMIN only
adminRouter.use(protect, isAdmin);

// Users
adminRouter.get("/users", getAllUsers);
adminRouter.patch("/users/:id/status", updateUserStatus);
adminRouter.patch("/users/:id/role", updateUserRole);
adminRouter.patch("/users/:id/credits",updateUserCredits);

// Stats
adminRouter.get("/stats", getAdminStats);


// // urls
// adminRouter.get("/urls",getAllUrls)
// adminRouter.delete("/urls/:id",deleteUrls);


// // credit Requests

// adminRouter.get("/credit-requests");
// adminRouter.patch("/credit-requests/:id/approve")


export default adminRouter;

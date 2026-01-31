import { Router } from "express";
import {
  createUrl,
  getUserUrls,
  redirectUrl,
  deactivateUrl,
} from "../controllers/url.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

// create short url (protected)
router.post("/", createUrl);

// get logged-in user's urls (protected)
router.get("/", getUserUrls);

// redirect short url (public)
router.get("/:shortCode", redirectUrl);

// deactivate url (protected)
router.patch("/:id", deactivateUrl);

export default router;

import { Router } from "express";
import {
  createUrl,
  getUserUrls,
  redirectUrl,
  deactivateUrl,
} from "../controllers/url.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

// create short url (protected)
router.post("/", protect, createUrl);

// get logged-in user's urls (protected)
router.get("/", protect, getUserUrls);

// redirect short url (public)
router.get("/:shortCode", redirectUrl);

// deactivate url (protected)

router.patch("/:id", protect, deactivateUrl);

export default router;

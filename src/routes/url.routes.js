import { Router } from "express";
import {
  createUrl,
  getUserUrls,
  redirectUrl,
  deactivateUrl,
} from "../controllers/url.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

import rateLimit from "express-rate-limit";

// 10 req in 1 minutes
const limiter = rateLimit({
  windowMs: 1000 * 60 * 1,
  max: 10,
  message: "Too many request limit reached",
});

const router = Router();

// create short url (protected)
router.post("/", protect, limiter, createUrl);

// get logged-in user's urls (protected)
router.get("/", protect, getUserUrls);

// redirect short url (public)
router.get("/:shortCode",limiter, redirectUrl);

// deactivate url (protected)

router.patch("/:id", protect, deactivateUrl);

export default router;

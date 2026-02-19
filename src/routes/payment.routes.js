import express from "express";
import { createOrder } from "../controllers/payment.controller.js";
import { protect } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/create-order", protect, createOrder);

export default router;

import express from "express";
import authRouter from "./src/routes/auth.routes.js";
import urlRouter from "./src/routes/url.routes.js";
import adminRouter from "./src/routes/admin.routes.js";
import cors from "cors";
import paymentRoutes from "./src/routes/payment.routes.js";
import webhookRoutes from "./src/routes/webhook.routes.js";
import cookieParser from "cookie-parser";
import { redirectUrl } from "./src/controllers/url.controller.js";

export const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use("/api/webhooks", webhookRoutes);

app.use(express.json());

app.use(cookieParser());
app.use("/api/auth", authRouter);

app.use("/api/urls", urlRouter);
app.get("/:shortCode", redirectUrl);
app.use("/api/admin", adminRouter);

app.use("/api/payments", paymentRoutes);

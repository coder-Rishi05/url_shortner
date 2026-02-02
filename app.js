import express from "express";
import { body, validationResult } from "express-validator";
import authRouter from "./src/routes/auth.routes.js";
import urlRouter from "./src/routes/url.routes.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

export const app = express();
// 10 req in 1 minutes
const limiter = rateLimit({
  windowMs: 1000 * 60 * 1,
  max: 10,
  message: "Too many request limit reached",
});

app.use(express.json());

app.use(limiter);
// app.use(helmet()); only for server
app.use("/api/auth", authRouter);

app.use("/api/urls", urlRouter);

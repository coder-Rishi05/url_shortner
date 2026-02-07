import express from "express";
import { body, validationResult } from "express-validator";
import authRouter from "./src/routes/auth.routes.js";
import urlRouter from "./src/routes/url.routes.js";
import adminRouter from "./src/routes/admin.routes.js";

export const app = express();
app.use(express.json());


app.use("/api/auth", authRouter);

app.use("/api/urls", urlRouter);

app.use("/api/admin", adminRouter);

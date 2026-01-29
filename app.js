import express from "express";
import { body, validationResult } from "express-validator";
import router from "./src/routes/auth.routes.js";

export const app = express();

app.use(express.json());

app.use("/auth/api/", router);

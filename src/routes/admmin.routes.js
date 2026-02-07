import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getUsers } from "../controllers/admin.controller.js";

const adminRouter = express.Router()

// get all the users
adminRouter.get("/allUsers",protect,getUsers);


export default adminRouter;
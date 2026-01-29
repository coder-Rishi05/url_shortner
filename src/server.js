import { app } from "../app.js";
import dotenv from "dotenv";
import { PORT } from "./utils/constant.js";
import { config } from "dotenv";
import connectDb from "./db/db.js";
import { env_PORT } from "./utils/env.js";

dotenv.config({
  path: "src/.env",
});

const startServer = async (req, res) => {
  try {
    await connectDb();

    app.on("error", (err) => {
      console.log("Error", err);
      throw err;
    });
    app.listen(env_PORT || PORT, () => {
      console.log(`server is running at : ${env_PORT || PORT}`);
    });
  } catch (error) {
    console.log("mongodb connection failed");
  }
};

startServer();

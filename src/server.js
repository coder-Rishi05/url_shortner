import "dotenv/config";  

import { app } from "../app.js";
import { PORT } from "./utils/constant.js";
import connectDb from "./db/db.js";
import { env_PORT } from "./utils/env.js";



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

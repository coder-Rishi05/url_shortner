import "dotenv/config";

import { app } from "../app.js";
import { const_PORT } from "./utils/constant.js";
import connectDb from "./db/db.js";
import { PORT } from "./utils/env.js";

import dotenv from "dotenv";
dotenv.config();

// // for getting client ip
// app.get("/ip", (req, res) => {
//   const clientIp =
//     req.headers["x-forwarded-for"] || req.connection.remoteAddress;
//   res.send(clientIp);
//   console.log(clientIp);
// });

const startServer = async (req, res) => {
  try {
    await connectDb();

    app.on("error", (err) => {
      console.log("Error", err);
      throw err;
    });
    app.listen(PORT || PORT, () => {
      console.log(`server is running at : ${PORT || const_PORT}`);
    });
  } catch (error) {
    console.log("mongodb connection failed");
  }
};

startServer();

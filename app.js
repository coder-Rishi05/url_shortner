import express from "express";
import authRouter from "./src/routes/auth.routes.js";
import urlRouter from "./src/routes/url.routes.js";
import adminRouter from "./src/routes/admin.routes.js";
import cors from "cors";
// import paymentRoutes from "./src/routes/payment.routes.js";
// import webhookRoutes from "./src/routes/webhook.routes.js";
import cookieParser from "cookie-parser";
import { redirectUrl } from "./src/controllers/url.controller.js";
// import passport from "passport";
// import session from "express-session";

export const app = express();

// const corsOptions = {
//   origin: "https://url-frontend-fhzz.onrender.com",
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// app.use(session({
//   secret: "mysecret",
//   resave: false,
//   saveUninitialized: true,
// }));

// app.use(passport.initialize());
// app.use(passport.session());

const allowedOrigins = [
  "http://localhost:5173",
  "https://url-frontend-fhzz.onrender.com",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// app.use(cors(corsOptions));

// app.use("/api/webhooks", webhookRoutes);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/urls", urlRouter);
app.get("/:shortCode", redirectUrl);
app.use("/api/admin", adminRouter); 
// app.use("/api/payments", paymentRoutes);

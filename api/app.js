import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./utils/config.js";
import cookieParser from "cookie-parser";
import passport from "passport";

//Routers
import { authRouter } from "./auth/authRoute.js";
import { tablesRouter } from "./tables/tablesRoutes.js";
import { inscriptionRouter } from "./inscriptions/inscriptionsRoutes.js";
import { userRouter } from "./user/userRoutes.js";

dotenv.config();
const app = express();

process.env.NODE_ENV === "production" &&
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") {
      return res.redirect(`https://${req.header("host")}${req.url}`);
    }
    next();
  });

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());

//routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tables", tablesRouter);
app.use("/api/v1/inscriptions", inscriptionRouter);
app.use('/api/v1/users', userRouter);

//Connection de la base de données et lancement du serveur

async function connect() {
  try {
    await pool
      .connect()
      .then((client) => {
        console.log("Connected to the database");
        client.release();
      })
      .catch((err) => {
        console.error("Error connecting to the database", err);
      });
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server", error);
  }
}
connect();

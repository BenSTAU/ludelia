import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./utils/config.js";

//Routers
import { authRouter } from "./auth/authRoute.js";
import passport from "passport";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(passport.initialize());

//routes
app.use("/api/v1/auth", authRouter);

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

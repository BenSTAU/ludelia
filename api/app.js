import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

async function connect() {
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
}
connect();

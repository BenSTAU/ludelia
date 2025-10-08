import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./utils/config.js";
import cookieParser from "cookie-parser";
import passport from "passport";

// Import des routers
import { authRouter } from "./auth/authRoute.js";
import { tablesRouter } from "./tables/tablesRoutes.js";
import { inscriptionRouter } from "./inscriptions/inscriptionsRoutes.js";
import { userRouter } from "./user/userRoutes.js";

dotenv.config();
const app = express();

// Redirige vers HTTPS en production si la requête est en HTTP
process.env.NODE_ENV === "production" &&
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") {
      return res.redirect(`https://${req.header("host")}${req.url}`);
    }
    next();
  });

// Configuration CORS pour autoriser le client et les cookies
app.use(
  cors({
    origin: ["https://ludelia.onrender.com", "http://localhost:5173"],
    credentials: true, // Permet l'envoi des cookies
  })
);
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());

// Déclaration des routes principales de l'API
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tables", tablesRouter);
app.use("/api/v1/inscriptions", inscriptionRouter);
app.use("/api/v1/users", userRouter);

// Connexion à la base de données et lancement du serveur
async function connect() {
  try {
    await pool
      .connect()
      .then((client) => {
        client.release();
        console.log("Connecté à la base de données PostgreSQL");
      })
      .catch((err) => {
        console.error("Erreur de connexion à la base de données", err.stack);
      });
    app.listen(process.env.PORT, () => {
      console.log(`Serveur démarré sur le port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Erreur lors du démarrage du serveur", error);
  }
}
connect();

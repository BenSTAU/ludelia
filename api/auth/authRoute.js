import express from "express";

import {
  ActivateAccount,
  forgottenPassword,
  loginWithUsernameAndPassword,
  logout,
  registerWithUsernameAndPassword,
  resendActivationEmail,
  resetPassword,
} from "./authController.js";
import {
  registerAndLoginWithGoogle,
  googleCallback,
} from "./authGoogleController.js";
import pool from "../utils/config.js";
import verifyToken from "../utils/verifyToken.js";

export const authRouter = express.Router();

//Inscription avec username/motdepasse
authRouter.post("/register", registerWithUsernameAndPassword);

//Connexion avec username/motdepasse
authRouter.post("/login", loginWithUsernameAndPassword);

//Déconnexion
authRouter.post("/logout", logout);

//Activation du compte
authRouter.get("/activate/:token", ActivateAccount);

//Renvoyer l'email d'activation
authRouter.post("/resendactivation", resendActivationEmail);

//Réinitialisation du mot de passe
authRouter.post("/forgotpassword", forgottenPassword);
authRouter.post("/resetpassword/:token", resetPassword);

//auth avec Google
authRouter.get("/google", registerAndLoginWithGoogle);
authRouter.get("/google/callback", googleCallback);

// endpoint pour vérifier le token
authRouter.get("/verifytoken", verifyToken, async (req, res) => {
  const query =
    "SELECT id_utilisateur, username, email FROM utilisateur WHERE id_utilisateur = $1";
  const result = await pool.query(query, [req.id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Utilisateur introuvable" });
  }

  res.json({ user: result.rows[0] });
});

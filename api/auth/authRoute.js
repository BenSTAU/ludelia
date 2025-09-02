import express from "express";

import {
  ActivateAccount,
  forgottenPassword,
  loginWithUsernameAndPassword,
  logout,
  registerAndLoginWithGoogle,
  registerWithUsernameAndPassword,
  resendActivationEmail,
  resetPassword,
} from "./authController.js";

export const authRouter = express.Router();

//Inscription avec username/motdepasse
authRouter.post("/register", registerWithUsernameAndPassword);

//Connexion avec username/motdepasse
authRouter.post("/login", loginWithUsernameAndPassword);

//Déconnexion
authRouter.post("/logout", logout);

//register et connexion avec Google
authRouter.post("/google", registerAndLoginWithGoogle);

//Activation du compte
authRouter.get("/activate/:token", ActivateAccount);

//Renvoyer l'email d'activation
authRouter.post("/resendactivation", resendActivationEmail);

//Réinitialisation du mot de passe
authRouter.post("/forgotpassword", forgottenPassword);
authRouter.post("/resetpassword/:token", resetPassword);

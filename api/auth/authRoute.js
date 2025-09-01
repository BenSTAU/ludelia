import express from "express";

import {
  ActivateAccount,
  loginWithUsernameAndPassword,
  registerAndLoginWithGoogle,
  registerWithUsernameAndPassword,
} from "./authController.js";

export const authRouter = express.Router();

//Inscription avec username/motdepasse
authRouter.post("/register", registerWithUsernameAndPassword);

//Connexion avec username/motdepasse
authRouter.post("/login", loginWithUsernameAndPassword);

//register et connexion avec Google
authRouter.post("/google", registerAndLoginWithGoogle);

//Activation du compte
authRouter.get("/activate/:token", ActivateAccount);

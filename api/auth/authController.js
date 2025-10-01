import pool from "../utils/config.js";
import bcrypt from "bcrypt";
import { emailRegex, passwordRegex, phoneRegex } from "../utils/regex.js";
import jwt from "jsonwebtoken";
import {
  htmlActivateAccount,
  htmlResetPassword,
  sendEmail,
} from "../utils/mail.js";

export async function registerWithUsernameAndPassword(req, res) {
  const client = await pool.connect();
  try {
    const { username, password, email, name, surname, telephone } = req.body;

    if (!username || !password || !email || !name || !surname || !telephone) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }
    // Vérifier si l'utilisateur existe
    const query = "SELECT * FROM utilisateur WHERE email = $1";
    const existingUser = await client.query(query, [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Utilisateur déjà existant" });
    }
    const queryExistingUsername =
      "SELECT * FROM utilisateur WHERE username = $1";
    const existingUsername = await client.query(queryExistingUsername, [
      username,
    ]);
    if (existingUsername.rows.length > 0) {
      return res.status(400).json({ message: "Nom d'utilisateur déjà pris" });
    }

    //tester avec les regex
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Le mot de passe doit contenir au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "L'email est invalide." });
    }

    if (!phoneRegex.test(telephone)) {
      return res
        .status(400)
        .json({ message: "Le numéro de téléphone est invalide." });
    }

    //hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    //Insérer dans la table Utilisateur
    await client.query("BEGIN");
    // Enregistrer le token d'activation dans la base de données

    const insertUserQuery = `
    INSERT INTO utilisateur (username, email, is_activated, name_user, surname, telephone, id_role) 
    VALUES ($1, $2, false, $3, $4, $5, 1)
    RETURNING id_utilisateur, activation_token;`;

    const result = await client.query(insertUserQuery, [
      username,
      email,
      name,
      surname,
      telephone,
    ]);

    // Récupérer l'ID de l'utilisateur
    const userId = result.rows[0].id_utilisateur;

    // Insérer dans la table Provider
    const insertProviderQuery = `
    INSERT INTO provider (provider_name, mdp_hash, id_utilisateur) 
    VALUES ('classique', $1, $2)`;
    await client.query(insertProviderQuery, [hashedPassword, userId]);

    await client.query("COMMIT");

    //envoi du mail d'activation
    const activationToken = result.rows[0].activation_token;
    const link = `${process.env.CLIENT_URL}/activatemail/${activationToken}`;
    const html = htmlActivateAccount(surname, link);

    await sendEmail(email, "Activation de votre compte", html);

    // Réponse de la requête positive
    res.status(201).json({ message: "Utilisateur enregistré avec succès" });
  } catch (error) {
    await client.query("ROLLBACK");
    res
      .status(500)
      .json({ message: "Erreur durant l'enregistrement", error: error });
  } finally {
    client.release();
  }
}

export async function loginWithUsernameAndPassword(req, res) {
  let isMj = false;
  let isAdmin = false;
  try {
    const { emailUsername, password } = req.body;

    if (!emailUsername || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    //Vérifier si le mail ou le nom d'utilisateur existe
    const query =
      "SELECT *, role.designation AS role_designation FROM utilisateur u JOIN provider ON u.id_utilisateur = provider.id_utilisateur JOIN role ON u.id_role = role.id_role WHERE u.email = $1 or u.username = $1";
    const user = await pool.query(query, [emailUsername]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "Identifiants incorrects" });
    }
    if (!user.rows[0].is_activated) {
      return res.status(403).json({
        message:
          "Compte non activé, veuillez vérifier votre email pour l'activer.",
      });
    }
    //vérifier si le mot de passe correspond
    const isMatch = await bcrypt.compare(password, user.rows[0].mdp_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

    //générer un token JWT
    const token = jwt.sign(
      {
        id: user.rows[0].id_utilisateur,
        role: user.rows[0].role_designation,
        email: user.rows[0].email,
        surname: user.rows[0].surname,
        name: user.rows[0].name_user,
        username: user.rows[0].username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    if (user.rows[0].role_designation === "admin") {
      isAdmin = true;
    } else if (user.rows[0].role_designation === "mj") {
      isMj = true;
    }

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.SAMESITE,
    });
    res.status(200).json({ message: "Connexion réussie", token, isMj, isAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur durant la connexion",
      error: error.message || error.toString(),
    });
  }
}

export async function ActivateAccount(req, res) {
  const client = await pool.connect();
  try {
    const { token } = req.params;
    const query = "SELECT * FROM utilisateur WHERE activation_token = $1";
    const result = await client.query(query, [token]);

    //Vérification si l'utilisateur existe
    const user = result.rows[0];
    if (!user) {
      return res.status(400).json({ message: "Token invalide ou expiré" });
    }

    //Vérification si le compte est déjà activé
    if (user.is_activated) {
      return res.status(400).json({ message: "Compte déjà activé" });
    }
    await client.query("BEGIN");

    //Activation du compte
    const updateQuery =
      "UPDATE utilisateur SET is_activated = true WHERE id_utilisateur = $1";
    await client.query(updateQuery, [user.id_utilisateur]);
    const deleteTokenQuery =
      "UPDATE utilisateur SET activation_token = NULL WHERE id_utilisateur = $1";
    await client.query(deleteTokenQuery, [user.id_utilisateur]);

    await client.query("COMMIT");

    res.status(200).json({ message: "Compte activé avec succès" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Activation error:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  } finally {
    client.release();
  }
}

export async function resendActivationEmail(req, res) {
  try {
    const { email } = req.body;

    const existingUserQuery = "SELECT * FROM utilisateur WHERE email = $1";
    const existingUser = await pool.query(existingUserQuery, [email]);
    if (!existingUser.rows.length > 0) {
      return res.json({
        message: "Si votre email existe, vous recevrez un email d'activation.",
      });
    }

    if (existingUser.rows[0].is_activated) {
      return res.status(400).json({ message: "Compte déjà activé." });
    }

    // Logique pour renvoyer l'email d'activation
    const activationToken = existingUser.rows[0].activation_token;
    const link = `${process.env.CLIENT_URL}/activatemail/${activationToken}`;
    const html = htmlActivateAccount(surname, link);

    await sendEmail(email, "Activation de votre compte", html);

    res.json({
      message: "Si votre email existe, vous recevrez un email d'activation.",
    });
  } catch (error) {
    console.error("Resend activation email error:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.SAMESITE,
    });
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function forgottenPassword(req, res) {
  const client = await pool.connect();
  try {
    const { emailUsername } = req.body;

    client.query("BEGIN");
    //Vérifier si le mail ou le nom d'utilisateur existe
    const query =
      "SELECT * FROM utilisateur JOIN provider ON utilisateur.id_utilisateur = provider.id_utilisateur WHERE utilisateur.email = $1 or utilisateur.username = $1";
    const user = await client.query(query, [emailUsername]);
    if (!user.rows.length > 0) {
      return res.json({
        message:
          "Si vos identifiants existent, vous recevrez un email de réinitialisation.",
      });
    }

    //logique de réinitialisation de mot de passe
    const expireAt = new Date(Date.now() + 60 * 60 * 1000);
    const queryResetToken =
      "INSERT INTO reset_tokens (id_utilisateur, expires_at) VALUES ($1, $2) RETURNING token";
    const result = await client.query(queryResetToken, [
      user.rows[0].id_utilisateur,
      expireAt,
    ]);
    const token = result.rows[0].token;

    const link = `${process.env.CLIENT_URL}/resetpassword/${token}`;
    const html = htmlResetPassword(user.rows[0].surname, link);
    await client.query("COMMIT");

    await sendEmail(
      user.rows[0].email,
      "Réinitialisation de votre mot de passe",
      html
    );

    res.json({
      message:
        "Si vos identifiants existent, vous recevrez un email de réinitialisation.",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Forgotten password error:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  } finally {
    client.release();
  }
}

export async function resetPassword(req, res) {
  const client = await pool.connect();
  try {
    const { token } = req.params;
    const { password } = req.body;

    //vérifier le mot de passe
    if (!password) {
      return res.status(400).json({ message: "Mot de passe requis." });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Le mot de passe doit contenir au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.",
      });
    }
    await client.query("BEGIN");

    const tokenQuery = "SELECT * FROM reset_tokens WHERE token = $1";
    const tokenResult = await client.query(tokenQuery, [token]);

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({ message: "Token invalide." });
    }

    const expireAt = tokenResult.rows[0].expires_at;
    if (expireAt < new Date()) {
      return res.status(400).json({ message: "Token expiré." });
    }

    const id_utilisateur = tokenResult.rows[0].id_utilisateur;
    const hashedPassword = await bcrypt.hash(password, 10);
    const updateQuery =
      "UPDATE provider SET mdp_hash = $1 WHERE id_utilisateur = $2";
    await client.query(updateQuery, [hashedPassword, id_utilisateur]);

    await client.query("COMMIT");
    res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: "Erreur interne du serveur" });
  } finally {
    client.release();
  }
}

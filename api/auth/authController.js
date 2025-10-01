// Import globaux (node_modules, librairies tierces)
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Import modules locaux / helpers
import pool from "../utils/config.js";
import { emailRegex, passwordRegex, phoneRegex } from "../utils/regex.js";
import {
  htmlActivateAccount,
  htmlResetPassword,
  sendEmail,
} from "../utils/mail.js";

// Inscription d'un utilisateur avec username et mot de passe
export async function registerWithUsernameAndPassword(req, res) {
  const client = await pool.connect();
  try {
    const { username, password, email, name, surname, telephone } = req.body;

    if (!username || !password || !email || !name || !surname || !telephone) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Vérifie si l'utilisateur existe déjà par email
    const queryEmail = `
      SELECT *
      FROM utilisateur
      WHERE email = $1
    `;
    const existingUser = await client.query(queryEmail, [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Utilisateur déjà existant" });
    }

    // Vérifie si le username est déjà pris
    const queryUsername = `
      SELECT *
      FROM utilisateur
      WHERE username = $1
    `;
    const existingUsername = await client.query(queryUsername, [username]);
    if (existingUsername.rows.length > 0) {
      return res.status(400).json({ message: "Nom d'utilisateur déjà pris" });
    }

    // Vérifie la validité du mot de passe, email et téléphone
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

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    await client.query("BEGIN");

    // Insère l'utilisateur en base
    const insertUserQuery = `
      INSERT INTO utilisateur (
        username,
        email,
        is_activated,
        name_user,
        surname,
        telephone,
        id_role
      )
      VALUES (
        $1,
        $2,
        false,
        $3,
        $4,
        $5,
        1
      )
      RETURNING id_utilisateur, activation_token
    `;
    const result = await client.query(insertUserQuery, [
      username,
      email,
      name,
      surname,
      telephone,
    ]);
    const userId = result.rows[0].id_utilisateur;

    // Insère le provider classique avec le hash du mot de passe
    const insertProviderQuery = `
      INSERT INTO provider (
        provider_name,
        mdp_hash,
        id_utilisateur
      )
      VALUES (
        'classique',
        $1,
        $2
      )
    `;
    await client.query(insertProviderQuery, [hashedPassword, userId]);

    await client.query("COMMIT");

    // Envoie l'email d'activation
    const activationToken = result.rows[0].activation_token;
    const link = `${process.env.CLIENT_URL}/activatemail/${activationToken}`;
    const html = htmlActivateAccount(surname, link);
    await sendEmail(email, "Activation de votre compte", html);

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

// Connexion d'un utilisateur avec username ou email et mot de passe
export async function loginWithUsernameAndPassword(req, res) {
  let isMj = false;
  let isAdmin = false;
  try {
    const { emailUsername, password } = req.body;

    if (!emailUsername || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Recherche l'utilisateur par email ou username
    const query = `
      SELECT *,
        role.designation AS role_designation
      FROM utilisateur u
      JOIN provider ON u.id_utilisateur = provider.id_utilisateur
      JOIN role ON u.id_role = role.id_role
      WHERE u.email = $1
        OR u.username = $1
    `;
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

    // Vérifie le mot de passe
    const isMatch = await bcrypt.compare(password, user.rows[0].mdp_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

    // Génère le token JWT
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
    res.status(500).json({
      message: "Erreur durant la connexion",
      error: error.message || error.toString(),
    });
  }
}

// Active le compte utilisateur via le token d'activation
export async function ActivateAccount(req, res) {
  const client = await pool.connect();
  try {
    const { token } = req.params;
    const query = `
      SELECT *
      FROM utilisateur
      WHERE activation_token = $1
    `;
    const result = await client.query(query, [token]);
    const user = result.rows[0];
    if (!user) {
      return res.status(400).json({ message: "Token invalide ou expiré" });
    }
    if (user.is_activated) {
      return res.status(400).json({ message: "Compte déjà activé" });
    }
    await client.query("BEGIN");

    // Active le compte et supprime le token d'activation
    const updateQuery = `
      UPDATE utilisateur
      SET is_activated = true
      WHERE id_utilisateur = $1
    `;
    await client.query(updateQuery, [user.id_utilisateur]);
    const deleteTokenQuery = `
      UPDATE utilisateur
      SET activation_token = NULL
      WHERE id_utilisateur = $1
    `;
    await client.query(deleteTokenQuery, [user.id_utilisateur]);

    await client.query("COMMIT");
    res.status(200).json({ message: "Compte activé avec succès" });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: "Erreur interne du serveur" });
  } finally {
    client.release();
  }
}

// Renvoyer l'email d'activation
export async function resendActivationEmail(req, res) {
  try {
    const { email } = req.body;

    const existingUserQuery = `
      SELECT *
      FROM utilisateur
      WHERE email = $1
    `;
    const existingUser = await pool.query(existingUserQuery, [email]);
    if (!existingUser.rows.length > 0) {
      return res.json({
        message: "Si votre email existe, vous recevrez un email d'activation.",
      });
    }
    if (existingUser.rows[0].is_activated) {
      return res.status(400).json({ message: "Compte déjà activé." });
    }

    // Génère et envoie le mail d'activation
    const activationToken = existingUser.rows[0].activation_token;
    const link = `${process.env.CLIENT_URL}/activatemail/${activationToken}`;
    const html = htmlActivateAccount(existingUser.rows[0].surname, link);

    await sendEmail(email, "Activation de votre compte", html);

    res.json({
      message: "Si votre email existe, vous recevrez un email d'activation.",
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

// Déconnexion de l'utilisateur
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

// Demande de réinitialisation du mot de passe
export async function forgottenPassword(req, res) {
  const client = await pool.connect();
  try {
    const { emailUsername } = req.body;

    await client.query("BEGIN");

    // Recherche l'utilisateur par email ou username
    const query = `
      SELECT *
      FROM utilisateur
      JOIN provider ON utilisateur.id_utilisateur = provider.id_utilisateur
      WHERE utilisateur.email = $1
        OR utilisateur.username = $1
    `;
    const user = await client.query(query, [emailUsername]);
    if (!user.rows.length > 0) {
      return res.json({
        message:
          "Si vos identifiants existent, vous recevrez un email de réinitialisation.",
      });
    }

    // Crée le token de réinitialisation
    const expireAt = new Date(Date.now() + 60 * 60 * 1000);
    const queryResetToken = `
      INSERT INTO reset_tokens (
        id_utilisateur,
        expires_at
      )
      VALUES (
        $1,
        $2
      )
      RETURNING token
    `;
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
    res.status(500).json({ message: "Erreur interne du serveur" });
  } finally {
    client.release();
  }
}

// Réinitialise le mot de passe via le token
export async function resetPassword(req, res) {
  const client = await pool.connect();
  try {
    const { token } = req.params;
    const { password } = req.body;

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

    // Vérifie le token de réinitialisation
    const tokenQuery = `
      SELECT *
      FROM reset_tokens
      WHERE token = $1
    `;
    const tokenResult = await client.query(tokenQuery, [token]);
    if (tokenResult.rows.length === 0) {
      return res.status(400).json({ message: "Token invalide." });
    }
    const expireAt = tokenResult.rows[0].expires_at;
    if (expireAt < new Date()) {
      return res.status(400).json({ message: "Token expiré." });
    }

    // Met à jour le mot de passe
    const id_utilisateur = tokenResult.rows[0].id_utilisateur;
    const hashedPassword = await bcrypt.hash(password, 10);
    const updateQuery = `
      UPDATE provider
      SET mdp_hash = $1
      WHERE id_utilisateur = $2
    `;
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

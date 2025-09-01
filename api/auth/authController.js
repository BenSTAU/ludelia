import pool from "../utils/config.js";
import bcrypt from "bcrypt";
import { emailRegex, passwordRegex, phoneRegex } from "../utils/regex.js";
import jwt from "jsonwebtoken";

export async function registerWithUsernameAndPassword(req, res) {
  const client = await pool.connect();
  try {
    const { username, password, email, name, surname, telephone } = req.body;

    if (!username || !password || !email || !name || !surname || !telephone) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }
    // Vérifier si l'utilisateur existe
    const query = "SELECT * FROM utilisateur WHERE email = $1";
    const existingUser = await pool.query(query, [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Utilisateur déjà existant" });
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

    const insertUserQuery = `
    INSERT INTO utilisateur (username, email, is_activated, name_user, surname, telephone, id_role) 
    VALUES ($1, $2, false, $3, $4, $5, 1)
    RETURNING id_utilisateur;`;

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
  try {
    const { email, username, password } = req.body;

    //Vérifier si le mail ou le nom d'utilisateur existe
    const query =
      "SELECT * FROM utilisateur JOIN provider ON utilisateur.id_utilisateur = provider.id_utilisateur WHERE email = $1 OR username = $2";
    const user = await pool.query(query, [email, username]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    console.log(user.rows[0]);

    //vérifier si le mot de passe correspond
    const isMatch = await bcrypt.compare(password, user.rows[0].mdp_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    //générer un token JWT
    const token = jwt.sign(
      { id: user.rows[0].id_utilisateur },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "Connexion réussie", token });
  } catch (error) {
    console.error(error); // affichage complet dans la console
    res.status(500).json({
      message: "Erreur durant la connexion",
      error: error.message || error.toString(),
    });
  }
}

export async function registerAndLoginWithGoogle(req, res) {}

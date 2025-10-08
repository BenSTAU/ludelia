// Import globaux (node_modules, librairies tierces)
import jwt from "jsonwebtoken";
import passport from "passport";

// Import du pool PostgreSQL
import pool from "../utils/config.js";

// Lance l'authentification Google avec Passport
export function registerAndLoginWithGoogle(req, res, next) {
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
}

// Callback appelé par Google après authentification
export async function googleCallback(req, res, next) {
  passport.authenticate(
    "google",
    {
      session: false, // On utilise JWT, pas les sessions
    },
    async (err, user) => {
      if (err) {
        if (err.message === "provider = classique") {
          // Redirige si le compte existe déjà en mode classique
          return res
            .status(400)
            .redirect(`${process.env.CLIENT_URL}/?google=classique`);
        }
        // Redirige en cas d'erreur d'authentification Google
        return res
          .status(400)
          .redirect(`${process.env.CLIENT_URL}/?google=false`);
      }

      if (!user) {
        // Redirige si aucun utilisateur n'est retourné par Google
        return res
          .status(400)
          .redirect(`${process.env.CLIENT_URL}/?google=false`);
      }

      // Récupère le rôle de l'utilisateur en base
      const roleQuery = `
        SELECT
          role.designation
        FROM utilisateur
        JOIN role ON utilisateur.id_role = role.id_role
        WHERE utilisateur.email = $1
      `;
      const roleValues = await pool.query(roleQuery, [user.email]);

      // Vérifie que le rôle existe avant de l'utiliser pour éviter une erreur TypeError
      if (!roleValues.rows.length) {
        return res
          .status(400)
          .redirect(`${process.env.CLIENT_URL}/?google=role_not_found`);
      }

      // Prépare les données utilisateur pour le JWT
      // Utilise directement les propriétés de l'objet user
      const token = jwt.sign(
        {
          id: user.id_utilisateur,
          email: user.email,
          role: roleValues.rows[0].designation,
          surname: user.surname || "utilisateur",
          name: user.name_user || "utilisateur",
          username: user.username || "utilisateur",
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Définit le cookie JWT
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.SAMESITE,
      });

      // Redirige vers le frontend après succès
      res.redirect(`${process.env.CLIENT_URL}/`);
    }
  )(req, res, next);
}

import jwt from "jsonwebtoken";
import passport from "passport";
import pool from "../utils/config.js";

export async function registerAndLoginWithGoogle(req, res, next) {
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
}

export async function googleCallback(req, res, next) {
  passport.authenticate(
    "google",
    {
      session: false, // On utilise JWT, pas les sessions
    },
    async (err, user) => {
      if (err) {
        if (err.message === "provider = classique") {
          return res
            .status(400)
            .redirect(`${process.env.CLIENT_URL}/?google=classique`);
        }
        console.error("Google callback error:", err);
        return res
          .status(400)
          .redirect(`${process.env.CLIENT_URL}/?google=false`);
      }

      if (!user) {
        return res
          .status(400)
          .redirect(`${process.env.CLIENT_URL}/?google=false`);
      }
      const roleQuery = `SELECT role.designation FROM utilisateur JOIN role ON utilisateur.id_role = role.id_role WHERE utilisateur.email = $1;`;
      const roleValues = await pool.query(roleQuery, [user.email]);

      // Générer un JWT
      const token = jwt.sign(
        {
          id: user.id_utilisateur,
          email: user.email,
          role: roleValues.rows[0].designation,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Définir le cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.SAMESITE,
      });

      // Rediriger vers le frontend
      res.redirect(`${process.env.CLIENT_URL}/`);
    }
  )(req, res, next);
}

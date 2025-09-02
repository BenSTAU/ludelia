import pg from "pg";
import dotenv from "dotenv";
dotenv.config();


import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

export default pool;


//config GoogleAuth

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const client = await pool.connect();

        //chercher l'utilisateur
        const queryUser =
          "SELECT * FROM utilisateur u JOIN provider p ON u.id_utilisateur = p.id_utilisateur WHERE p.provider_id = $1";
        const existingUser = await client.query(queryUser, [profile.id]);

        if (existingUser.rows.length > 0 && existingUser.rows[0].provider_name === "google") {
          // L'utilisateur existe déjà
          client.release();
          return done(null, existingUser.rows[0]);
        } else if (existingUser.rows.length > 0 && existingUser.rows[0].provider_name == "classique") {
          // L'utilisateur existe avec un autre provider
          client.release();
          return done(new Error("provider = classique"));
        }

        //créer un nouveau utilisateur
        await client.query("BEGIN");
        const queryInsert = `INSERT INTO utilisateur (username, email, is_activated, name_user, surname, telephone, id_role, activation_token) 
           VALUES ($1, $2, true, $3, $4, $5, 1, NULL) RETURNING id_utilisateur`;
        const result = await client.query(queryInsert, [
          profile.displayName,
          profile.emails[0].value,
          profile.name.familyName,
          profile.name.givenName,
          profile.phone,
        ]);

        const userId = result.rows[0].id_utilisateur;

        const providerQuery = `INSERT INTO provider (provider_name, provider_id, id_utilisateur) 
       VALUES ($1, $2, $3)`;

        await client.query(providerQuery, ["google", profile.id, userId]);

        await client.query("COMMIT");

        // Récupérer l'utilisateur complet
        const newUser = await client.query(
          "SELECT * FROM utilisateur WHERE id_utilisateur = $1",
          [userId]
        );

        client.release();
        return done(null, newUser.rows[0]);
      } catch (error) {

        console.error("Error fetching user:", error);
        done(error);
      }
    }
  )
);

// Import du pool PostgreSQL
import pool from "./config.js";

// Vérifie que l'utilisateur existe et que son rôle est 'mj' ou 'admin'
export async function verifyRoleMjOrAdmin(req, res, next) {
  try {
    const userRole = req.user.role;
    // Vérifie l'existence de l'utilisateur en base
    const existingUserQuery = `
      SELECT *
      FROM utilisateur
      WHERE id_utilisateur = $1
    `;
    const existingUser = await pool.query(existingUserQuery, [req.user.id]);
    if (existingUser.rowCount === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifie le rôle de l'utilisateur
    if (userRole !== "mj" && userRole !== "admin") {
      return res.status(403).json({ message: "Accès refusé" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

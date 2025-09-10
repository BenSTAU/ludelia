import pool from "./config.js";

export async function verifyRoleMjOrAdmin(req, res, next) {
  try {
    const userRole = req.user.role;
    console.log("User role:", userRole);
    //Vérification que l'utilisateur existe
    const existingUserQuery =
      "SELECT * FROM utilisateur WHERE id_utilisateur = $1";
    const existingUser = await pool.query(existingUserQuery, [req.user.id]);
    if (existingUser.rowCount === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier si le rôle de l'utilisateur est 'mj' ou 'admin'
    if (userRole !== "mj" && userRole !== "admin") {
      return res.status(403).json({ message: "Accès refusé" });
    }
    next();
  } catch (error) {
    console.error("Role verification error:", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

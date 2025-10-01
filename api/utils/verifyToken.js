import jwt from "jsonwebtoken";

// Vérifie la présence et la validité du token JWT dans les cookies
export default function verifyToken(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Décode le token et ajoute les infos utilisateur à la requête
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.id = decoded.id;
    req.role = decoded.role;

    next();
  } catch (error) {
    // Retourne une erreur serveur si le token est invalide ou absent
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

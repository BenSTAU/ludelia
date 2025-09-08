import jwt from "jsonwebtoken";
export default function verifyToken(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.id = decoded.id;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

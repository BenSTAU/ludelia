import pool from "../utils/config.js";

//Récupérer les informations des mj
export async function getMjInfo(req, res) {
    try {
        const query = "SELECT id_utilisateur, username, surname, name_user, email, role.designation  FROM utilisateur JOIN role ON utilisateur.id_role = role.id_role WHERE role.designation IN ('mj', 'admin');";
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching MJ info:", error);
        res.status(500).json({ message: "Erreur durant la récupération", error: error });
    }
}
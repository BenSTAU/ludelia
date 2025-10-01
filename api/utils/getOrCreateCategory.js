// Vérifie si la catégorie existe, sinon la crée en base et retourne l'objet
export async function getOrCreateCategory(client, name) {
  try {
    name = name.trim().toLowerCase();
    if (!name) {
      throw new Error("Le nom de la catégorie ne peut pas être vide");
    }

    // Recherche la catégorie existante
    const existingCategoryQuery = `
      SELECT *
      FROM categorie
      WHERE designation = $1
    `;
    const existingCategory = await client.query(existingCategoryQuery, [name]);
    if (existingCategory.rowCount > 0) {
      return existingCategory.rows[0];
    }

    // Crée une nouvelle catégorie si elle n'existe pas
    const createCategoryQuery = `
      INSERT INTO categorie (designation)
      VALUES ($1)
      RETURNING *
    `;
    const newCategory = await client.query(createCategoryQuery, [name]);
    return newCategory.rows[0];
  } catch (error) {
    // Annule la transaction en cas d'erreur
    await client.query("ROLLBACK");
    throw error;
  }
}

export async function getOrCreateCategory(client, name) {
  try {
    name = name.trim().toLowerCase();
    if (!name) {
      throw new Error("Le nom de la catégorie ne peut pas être vide");
    }
    const existingCategoryQuery =
      "SELECT * FROM categorie WHERE designation = $1";
    const existingCategory = await client.query(existingCategoryQuery, [name]);
    if (existingCategory.rowCount > 0) {
      return existingCategory.rows[0];
    }

    const createCategoryQuery =
      "INSERT INTO categorie (designation) VALUES ($1) RETURNING *";
    const newCategory = await client.query(createCategoryQuery, [name]);
    return newCategory.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}

import pool from "../utils/config.js";
import { getOrCreateCategory } from "../utils/getOrCreateCategory.js";
import { htmlInvitationCancellation } from "../utils/mail.js";

//Récupérer 1 table avec id
export async function getOneTable(req, res) {
  try {
    const id = req.params.id;
    const query = "select * from partie where id= $1";
    const table = await pool.query(query, [id]);

    if (table.rowCount === 0) {
      return res.status(404).json({ message: "Partie non trouvée" });
    }
    res.status(200).json(table.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur durant la récupération", error: error });
  }
}

//Récupérer toutes les tables
export async function getAllTables(req, res) {
  try {
    const query =
      "SELECT p.id_partie, p.nom, p.nbr_places, p.description, p.start_at, p.end_at, u.username AS mj,  d.designation AS difficulty,  c.designation AS category,  s.designation AS status FROM partie p JOIN utilisateur u ON p.id_utilisateur = u.id_utilisateur JOIN difficulte d ON p.id_difficulte = d.id_difficulte JOIN categorie c ON p.id_categorie = c.id_categorie JOIN statut s ON p.id_statut = s.id_statut;";
    let tables = await pool.query(query);

    const duration = (start, end) => {
      const diff = new Date(end) - new Date(start);
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      return `${hours}h ${minutes}m`;
    };
    tables.rows.forEach((table) => {
      table.duration = duration(table.start_at, table.end_at);
    });
    const tablesSorted = tables.rows.sort((a, b) => a.start_at - b.start_at);
    res.status(200).json(tablesSorted);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur durant la récupération", error: error });
  }
}

//récupérer les tables avec un statut ouvert
export async function getOpenTables(req, res) {
  try {
    const query = `SELECT p.id_partie, 
    p.nom, 
    p.nbr_places, 
    p.description, 
    p.start_at, 
    p.end_at, 
    u.username AS mj,  
    d.designation AS difficulty,  
    c.designation AS category,  
    s.designation AS status FROM partie p 
    JOIN utilisateur u ON p.id_utilisateur = u.id_utilisateur 
    JOIN difficulte d ON p.id_difficulte = d.id_difficulte 
    JOIN categorie c ON p.id_categorie = c.id_categorie 
    JOIN statut s ON p.id_statut = s.id_statut
    WHERE s.designation = 'Ouvert';`;
    const tables = await pool.query(query);

    const duration = (start, end) => {
      const diff = new Date(end) - new Date(start);
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      return `${hours}h ${minutes}m`;
    };

    const queryInvitationCountByTables = `SELECT id_partie, COUNT(*) AS invitation_count FROM invitation WHERE id_statut = 1 GROUP BY id_partie;`;
    const invitationCounts = await pool.query(queryInvitationCountByTables);
    const queryInscriptionsCountByTables = `SELECT id_partie, COUNT(*) AS inscription_count FROM inscription WHERE id_statut = 1 GROUP BY id_partie;`;
    const inscriptionCounts = await pool.query(queryInscriptionsCountByTables);

    tables.rows.forEach((table) => {
      table.duration = duration(table.start_at, table.end_at);
      const invitationCount = invitationCounts.rows.find((row) => row.id_partie === table.id_partie);
      table.invitation_count = parseInt(invitationCount ? invitationCount.invitation_count : 0);

      const inscriptionCount = inscriptionCounts.rows.find((row) => row.id_partie === table.id_partie);
      table.inscription_count = parseInt(inscriptionCount ? inscriptionCount.inscription_count : 0);
      table.nbrInscriptionsValides = table.invitation_count + table.inscription_count;
    });

    res.status(200).json({ tables: tables.rows });
  } catch (error) {
    console.error("Erreur lors de la récupération des tables ouvertes :", error);
    res
      .status(500)
      .json({ message: "Erreur durant la récupération", error: error });
  }
}
//Récupérer les tables où je suis inscrit
export async function getMyTables(req, res) {
  try {
    const id_utilisateur = req.id;
    const queryParties = `SELECT 
    p.id_partie, 
    p.nom, 
    p.nbr_places, 
    p.description, 
    p.start_at, 
    p.end_at, 
    u.username AS mj,  
    d.designation AS difficulty,  
    c.designation AS category,  
    s.designation AS status
FROM partie p
JOIN utilisateur u ON p.id_utilisateur = u.id_utilisateur
JOIN difficulte d ON p.id_difficulte = d.id_difficulte
JOIN categorie c ON p.id_categorie = c.id_categorie
JOIN statut s ON p.id_statut = s.id_statut
JOIN inscription i ON p.id_partie = i.id_partie
JOIN statut si ON i.id_statut = si.id_statut
WHERE i.id_utilisateur = $1
  AND s.designation = 'Ouvert'
  AND si.designation = 'Valide';`;
    const tables = await pool.query(queryParties, [id_utilisateur]);
    const tablesSorted = tables.rows.sort((a, b) => a.start_at - b.start_at);

    res.status(200).json({ tables: tablesSorted });
  } catch (error) {
    console.error("Erreur lors de la récupération des tables :", error);
    res
      .status(500)
      .json({ message: "Erreur durant la récupération", error: error });
  }
}

//Récupérer les tables que je gère en tant que MJ avec les inscriptions et les invitations
export async function getMyTablesMj(req, res) {
  try {
    const id = req.id;

    const query = `SELECT p.id_partie, p.nom, p.nbr_places, p.description, p.start_at, p.end_at, u.username AS mj,  d.designation AS difficulty,  c.designation AS category,  s.designation AS status FROM partie p JOIN utilisateur u ON p.id_utilisateur = u.id_utilisateur JOIN difficulte d ON p.id_difficulte = d.id_difficulte JOIN categorie c ON p.id_categorie = c.id_categorie JOIN statut s ON p.id_statut = s.id_statut WHERE p.id_utilisateur = $1;`;
    const tables = await pool.query(query, [id]);
    const tablesSorted = tables.rows.sort((a, b) => a.start_at - b.start_at);

    //Récupérer les inscriptions de la partie et les invitations
    for (const table of tablesSorted) {
      const inscriptionsQuery = `SELECT * FROM inscription JOIN utilisateur ON inscription.id_utilisateur = utilisateur.id_utilisateur WHERE id_partie = $1 AND id_statut = 1`;
      const inscriptionsResult = await pool.query(inscriptionsQuery, [table.id_partie]);
      table.inscriptions = inscriptionsResult.rows;

      const invitationsQuery = `SELECT invitation.* FROM invitation JOIN inscription on invitation.id_inscription = inscription.id_inscription WHERE inscription.id_partie = $1 AND invitation.id_statut = 1`;
      const invitationsResult = await pool.query(invitationsQuery, [table.id_partie]);
      table.invitations = invitationsResult.rows;
    }


    res.status(200).json({ tables: tablesSorted });
  } catch (error) {
    console.error("Erreur lors de la récupération des tables MJ :", error);
    res
      .status(500)
      .json({ message: "Erreur durant la récupération", error: error });
  }
}

//Créer une table
export async function createTable(req, res) {
  const client = await pool.connect();
  try {
    const {
      nom,
      nbr_places,
      start_at,
      end_at,
      description,
      id_evenement,
      id_utilisateur,
      statut,
      difficulte,
      categorie,
    } = req.body;

    const id_utilisateurRequesting = req.id;
    //Vérification des champs obligatoires

    if (
      !nom ||
      !nbr_places ||
      !start_at ||
      !end_at ||
      !description ||
      !id_evenement ||
      !id_utilisateur ||
      !statut ||
      !difficulte ||
      !categorie
    ) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    //Etant donné que l'application est en développement et ne prendra en compte qu'un seul événement
    //id_evenement est fixé à 1
    const evenementId = 3;

    // //Vérification que l'événement existe
    // const existingEventQuery = "SELECT * FROM evenement WHERE id = $1";
    // const existingEvent = await client.query(existingEventQuery, [id_evenement]);
    // if (existingEvent.rowCount === 0) {
    //     return res.status(404).json({ message: "Événement non trouvé" });
    // }

    //Vérification que l'utilisateur demandé en mj existe
    const existingUserQuery =
      "SELECT utilisateur.*, role.designation AS role_designation FROM utilisateur LEFT JOIN role ON utilisateur.id_role = role.id_role WHERE utilisateur.id_utilisateur = $1;";
    const existingUser = await client.query(existingUserQuery, [
      id_utilisateur,
    ]);
    if (existingUser.rowCount === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    //Verification que l'utilisateur est un MJ
    if (
      existingUser.rows[0].role_designation !== "mj" &&
      existingUser.rows[0].role_designation !== "admin"
    ) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    //vérification que le nombre de places est correct
    if (nbr_places < 1) {
      return res.status(400).json({
        message: "Nombre de places invalide, il ne peut pas être inférieur à 1",
      });
    }

    //Récupérer le statut
    const existingStatutQuery = "SELECT * FROM statut WHERE designation = $1";
    const existingStatut = await client.query(existingStatutQuery, [statut]);
    if (existingStatut.rowCount === 0) {
      return res.status(404).json({ message: "Statut non trouvé" });
    }
    const statutId = existingStatut.rows[0].id_statut;

    //Récupérer la difficulté
    const existingDifficulteQuery =
      "SELECT * FROM difficulte WHERE designation = $1";
    const existingDifficulte = await client.query(existingDifficulteQuery, [
      difficulte,
    ]);
    if (existingDifficulte.rowCount === 0) {
      return res.status(404).json({ message: "Difficulté non trouvée" });
    }
    const difficulteId = existingDifficulte.rows[0].id_difficulte;

    //Vérifier les dates
    const startDate = new Date(start_at);
    const endDate = new Date(end_at);
    if (isNaN(startDate) || isNaN(endDate) || startDate >= endDate) {
      return res.status(400).json({ message: "Dates invalides" });
    }
    if (startDate < new Date()) {
      return res
        .status(400)
        .json({ message: "La date de début doit être dans le futur" });
    }
    await client.query("BEGIN");

    // Récupérer la catégorie (ou la créer si elle n'existe pas)
    const existingCategorie = await getOrCreateCategory(client, categorie);
    const categorieId = existingCategorie.id_categorie;

    //gérer le créneau horaire
    const existingCreneauQuery = `SELECT * FROM creneau WHERE mj = $1 AND start_at < $2 AND end_at > $3`;

    const existingCreneau = await client.query(existingCreneauQuery, [
      id_utilisateur,
      startDate,
      endDate,
    ]);

    if (existingCreneau.rowCount > 0) {
      await client.query("ROLLBACK");
      return res
        .status(409)
        .json({ message: "Créneau horaire en conflit avec un autre" });
    }
    const createCreneauQuery = `INSERT INTO creneau (mj, start_at, end_at, id_evenement) VALUES ($1, $2, $3, $4) RETURNING id_creneau`;
    const newCreneau = await client.query(createCreneauQuery, [
      id_utilisateur,
      startDate,
      endDate,
      evenementId,
    ]);
    const creneauId = newCreneau.rows[0].id_creneau;

    //Créer la table de jeu de rôle
    const createTable =
      "INSERT INTO partie (nom, nbr_places, start_at, end_at, description, id_creneau, id_evenement, id_utilisateur, id_statut, id_difficulte, id_categorie) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *";
    const newTable = await client.query(createTable, [
      nom,
      nbr_places,
      startDate,
      endDate,
      description,
      creneauId,
      evenementId,
      id_utilisateur,
      statutId,
      difficulteId,
      categorieId,
    ]);
    await client.query("COMMIT");
    res
      .status(201)
      .json({ message: "Table créée avec succès", table: newTable.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log("Error details:", error);
    res
      .status(500)
      .json({ message: "Erreur durant la création", error: error });
  } finally {
    client.release();
  }
}

//modifier une table
export async function updateTable(req, res) {
  const client = await pool.connect();
  try {
    let {
      nom,
      nbr_places,
      start_at,
      end_at,
      description,
      id_utilisateur,
      statut,
      difficulte,
      categorie,
    } = req.body;

    const id = req.params.id;

    let id_statut, id_difficulte, id_categorie, newCreneauId;

    //vérification des champs obligatoires
    const existingTableQuery = "SELECT * FROM partie WHERE id_partie = $1";
    const existingTable = await client.query(existingTableQuery, [id]);
    if (existingTable.rowCount === 0) {
      return res.status(404).json({ message: "Table non trouvée" });
    }

    //Vérification que le mj demandé existe et est bien mj
    if (id_utilisateur !== existingTable.rows[0].id_utilisateur) {
      const existingUserQuery =
        "SELECT utilisateur.*, role.designation AS role_designation FROM utilisateur LEFT JOIN role ON utilisateur.id_role = role.id_role WHERE utilisateur.id_utilisateur = $1;";
      const existingUser = await client.query(existingUserQuery, [
        id_utilisateur,
      ]);
      if (existingUser.rowCount === 0) {
        return res
          .status(404)
          .json({ message: "Utilisateur non trouvé pour le MJ demandé" });
      }
      if (
        existingUser.rows[0].role_designation !== "mj" &&
        existingUser.rows[0].role_designation !== "admin"
      ) {
        return res.status(403).json({
          message: "Accès refusé, le MJ demandé pour cette table n'est pas MJ",
        });
      }
    } else {
      id_utilisateur = existingTable.rows[0].id_utilisateur;
    }
    // Vérification de l'événement mais comme l'application n'en gère qu'un seul pour le moment, on ne le modifie pas
    const id_evenement = existingTable.rows[0].id_evenement;

    //Vérification du nom et de la description
    if (!nom) {
      nom = existingTable.rows[0].nom;
    }
    if (!description) {
      description = existingTable.rows[0].description;
    }
    //vérifier le statut
    if (statut !== existingTable.rows[0].id_statut) {
      const existingStatutQuery = "SELECT * FROM statut WHERE designation = $1";
      const existingStatut = await client.query(existingStatutQuery, [statut]);
      if (existingStatut.rowCount === 0) {
        return res.status(404).json({ message: "Statut non trouvé" });
      }
      id_statut = existingStatut.rows[0].id_statut;
    } else {
      id_statut = existingTable.rows[0].id_statut;
    }
    //vérifier la difficulté
    if (difficulte !== existingTable.rows[0].id_difficulte) {
      const existingDifficulteQuery =
        "SELECT * FROM difficulte WHERE designation = $1";
      const existingDifficulte = await client.query(existingDifficulteQuery, [
        difficulte,
      ]);
      if (existingDifficulte.rowCount === 0) {
        return res.status(404).json({ message: "Difficulté non trouvée" });
      }
      id_difficulte = existingDifficulte.rows[0].id_difficulte;
    } else {
      id_difficulte = existingTable.rows[0].id_difficulte;
    }
    //vérifier le nombre de places
    if (nbr_places < 1) {
      return res.status(400).json({
        message: "Nombre de places invalide, il ne peut pas être inférieur à 1",
      });
    }
    //Vérifier les dates
    const startDate = new Date(start_at);
    const endDate = new Date(end_at);
    if (isNaN(startDate) || isNaN(endDate) || startDate >= endDate) {
      return res.status(400).json({ message: "Dates invalides" });
    }
    if (startDate < new Date()) {
      return res
        .status(400)
        .json({ message: "La date de début doit être dans le futur" });
    }

    await client.query("BEGIN");
    //vérifier la catégorie
    if (categorie !== existingTable.rows[0].id_categorie) {
      const existingCategorie = await getOrCreateCategory(client, categorie);
      id_categorie = existingCategorie.id_categorie;
    } else {
      id_categorie = existingTable.rows[0].id_categorie;
    }
    // Gérer le créneau horaire
    if (
      startDate.toISOString() !==
        existingTable.rows[0].start_at.toISOString() ||
      endDate.toISOString() !== existingTable.rows[0].end_at.toISOString()
    ) {
      // Les dates ont changé, on doit vérifier les conflits et mettre à jour

      // 1. Vérifier les conflits avec d'autres créneaux du même MJ
      // On exclut le créneau actuel de la vérification
      const conflictQuery = `
        SELECT * FROM creneau 
        WHERE mj = $1 
        AND id_creneau != $2 
        AND start_at < $3 
        AND end_at > $4
      `;

      const conflictCheck = await client.query(conflictQuery, [
        id_utilisateur,
        existingTable.rows[0].id_creneau, // Exclure le créneau actuel
        endDate, // Fin du nouveau créneau
        startDate, // Début du nouveau créneau
      ]);

      if (conflictCheck.rowCount > 0) {
        await client.query("ROLLBACK");
        return res.status(409).json({
          message: "Créneau horaire en conflit avec un autre créneau existant",
        });
      }

      // 2. Pas de conflit, on peut mettre à jour le créneau existant
      await client.query(
        `UPDATE creneau SET start_at = $1, end_at = $2, mj = $3 WHERE id_creneau = $4`,
        [startDate, endDate, id_utilisateur, existingTable.rows[0].id_creneau]
      );

      // Le créneau reste le même, seules les dates changent
      newCreneauId = existingTable.rows[0].id_creneau;
    } else {
      // Les dates n'ont pas changé, mais le MJ a peut-être changé
      if (id_utilisateur !== existingTable.rows[0].id_utilisateur) {
        // Le MJ a changé, on doit vérifier les conflits pour le nouveau MJ
        const conflictQuery = `
          SELECT * FROM creneau 
          WHERE mj = $1 
          AND start_at < $2 
          AND end_at > $3
        `;

        const conflictCheck = await client.query(conflictQuery, [
          id_utilisateur,
          endDate,
          startDate,
        ]);

        if (conflictCheck.rowCount > 0) {
          await client.query("ROLLBACK");
          return res.status(409).json({
            message: "Le nouveau MJ a déjà un créneau qui entre en conflit",
          });
        }

        // Pas de conflit, on met à jour le MJ du créneau
        await client.query(`UPDATE creneau SET mj = $1 WHERE id_creneau = $2`, [
          id_utilisateur,
          existingTable.rows[0].id_creneau,
        ]);
      }

      // Dans tous les cas, on garde le même créneau
      newCreneauId = existingTable.rows[0].id_creneau;
    }
    const tableUpdateQuery = `UPDATE partie SET nom=$1, nbr_places=$2, start_at=$3, end_at=$4, description=$5, id_evenement=$6, id_creneau=$7, id_utilisateur=$8, id_statut=$9, id_difficulte=$10, id_categorie=$11 WHERE id_partie=$12 RETURNING *`;
    const updatedTable = await client.query(tableUpdateQuery, [
      nom,
      nbr_places,
      startDate,
      endDate,
      description,
      id_evenement,
      newCreneauId,
      id_utilisateur,
      id_statut,
      id_difficulte,
      id_categorie,
      id,
    ]);
    await client.query("COMMIT");

    return res.status(200).json({
      message: "Table mise à jour avec succès",
      table: updatedTable.rows[0],
    });
  } catch (error) {
    console.log("Error details:", error);
    await client.query("ROLLBACK");
    res.status(500).json({ message: "Erreur durant l'update", error: error });
  } finally {
    client.release();
  }
}

//Supprimer une table
export async function deleteTable(req, res) {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    //Vérifier que la table existe
    const existingTableQuery = "SELECT * FROM partie WHERE id_partie = $1";
    const existingTable = await client.query(existingTableQuery, [id]);

    if (existingTable.rowCount === 0) {
      return res.status(404).json({ message: "Table non trouvée" });
    }
    await client.query("BEGIN");
    //Supprimer la table
    const deleteTableQuery = "DELETE FROM partie WHERE id_partie = $1";
    await client.query(deleteTableQuery, [id]);

    //Supprimer le créneau associé
    const deleteCreneauQuery = "DELETE FROM creneau WHERE id_creneau = $1";
    await client.query(deleteCreneauQuery, [existingTable.rows[0].id_creneau]);

    await client.query("COMMIT");
    return res.status(200).json({ message: "Table supprimée avec succès" });
  } catch (error) {
    console.error("Error details:", error);
    await client.query("ROLLBACK");
    res
      .status(500)
      .json({ message: "Erreur durant la suppression", error: error });
  } finally {
    client.release();
  }
}
// gestion passage du statut en fermé
export async function closeTable(req, res) {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    // Vérifier que la table existe
    const existingTableQuery = "SELECT * FROM partie WHERE id_partie = $1";
    const existingTable = await client.query(existingTableQuery, [id]);

    if (existingTable.rowCount === 0) {
      return res.status(404).json({ message: "Table non trouvée" });
    }

    await client.query("BEGIN");

    // Mettre à jour le statut de la table
    const closeTableQuery =
      "UPDATE partie SET id_statut = (SELECT id_statut FROM statut WHERE designation = 'fermé') WHERE id_partie = $1";
    await client.query(closeTableQuery, [id]);

    await client.query("COMMIT");

    // Récupérer les inscriptions et invitations associées à la table
    const inscriptionsFetchQuery =
      "SELECT * FROM inscription WHERE id_partie = $1";
    const invitationsFetchQuery =
      "SELECT * FROM invitation WHERE id_partie = $1";
    const inscriptions = await client.query(inscriptionsFetchQuery, [id]);
    const invitations = await client.query(invitationsFetchQuery, [id]);

    // Changer le statut en "Annulé" pour toutes les inscriptions et invitations
    const updateInscriptionStatusQuery =
      "UPDATE inscription SET id_statut = (SELECT id_statut FROM statut WHERE designation = 'annulé') WHERE id_partie = $1";
    await client.query(updateInscriptionStatusQuery, [id]);
    const updateInvitationStatusQuery =
      "UPDATE invitation SET id_statut = (SELECT id_statut FROM statut WHERE designation = 'annulé') WHERE id_partie = $1";
    await client.query(updateInvitationStatusQuery, [id]);
    await client.query("COMMIT");

    // Envoyer l'email pour chaque inscription
    for (const inscription of inscriptions.rows) {
      await sendEmail(
        inscription.email,
        "Annulation de votre inscription",
        htmlInvitationCancellation(
          inscription.surname,
          existingTable.rows[0].nom
        )
      );
    }
    // Envoyer l'email pour chaque invitation
    for (const invitation of invitations.rows) {
      await sendEmail(
        invitation.email,
        "Annulation de votre invitation",
        htmlInvitationCancellation(invitation.nom, existingTable.rows[0].nom)
      );
    }
    return res.status(200).json({ message: "Table fermée avec succès" });
  } catch (error) {
    console.error("Error details:", error);
    await client.query("ROLLBACK");
    res
      .status(500)
      .json({ message: "Erreur durant la fermeture", error: error });
  } finally {
    client.release();
  }
}

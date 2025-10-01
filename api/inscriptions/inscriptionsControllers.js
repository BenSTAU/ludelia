import pool from "../utils/config.js";
import { formatDate } from "../utils/formatDate.js";
import {
  htmlInscriptionConfirmation,
  htmlInvitationCancellation,
  sendEmail,
} from "../utils/mail.js";

// Récupère toutes les inscriptions avec les invitations associées
export async function getAllInscriptions(req, res) {
  try {
    const query = `
      SELECT *
      FROM inscription
      JOIN invitation ON invitation.id_inscription = inscription.id_inscription
    `;
    const inscriptions = await pool.query(query);

    res.json({
      inscriptions: inscriptions.rows,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

// Récupère les inscriptions et invitations valides
export async function getValidInscriptions(req, res) {
  try {
    const queryInscriptions = `
      SELECT *
      FROM inscription
      WHERE id_statut = 1
    `;
    const inscriptions = await pool.query(queryInscriptions);

    const queryInvitations = `
      SELECT *
      FROM invitation
      WHERE id_statut = 1
    `;
    const invitations = await pool.query(queryInvitations);

    res.json({
      inscriptions: inscriptions.rows,
      invitations: invitations.rows,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

// Récupère les inscriptions d'une table
export async function getInscriptionsByTable(req, res) {
  const { tableId } = req.params;
  try {
    const query = `
      SELECT *
      FROM inscription
      JOIN invitation ON invitation.id_inscription = inscription.id_inscription
      WHERE id_partie = $1
    `;
    const inscriptions = await pool.query(query, [tableId]);

    res.json({
      inscriptions: inscriptions.rows,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

// Récupère les inscriptions valides d'une table
export async function getValidInscriptionsByTable(req, res) {
  const { tableId } = req.params;
  try {
    const query = `
      SELECT *
      FROM inscription
      JOIN invitation ON invitation.id_inscription = inscription.id_inscription
      WHERE id_partie = $1
        AND id_statut = 1
    `;
    const inscriptions = await pool.query(query, [tableId]);
    res.json({
      inscriptions: inscriptions.rows,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

// Récupère une inscription par son ID
export async function getInscriptionById(req, res) {
  const { id } = req.params;
  try {
    const query = `
      SELECT *
      FROM inscription
      JOIN invitation ON invitation.id_inscription = inscription.id
      WHERE id = $1
    `;
    const inscription = await pool.query(query, [id]);
    res.json(inscription.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

// Récupère toutes mes inscriptions valides et les invitations associées
export async function getMyValidInscriptions(req, res) {
  const id_utilisateur = req.id;
  try {
    const queryInscriptions = `
      SELECT *
      FROM inscription
      WHERE inscription.id_utilisateur = $1
        AND inscription.id_statut = 1
    `;
    const inscriptions = await pool.query(queryInscriptions, [id_utilisateur]);

    const queryInvitations = `
      SELECT invitation.*
      FROM invitation
      JOIN inscription ON inscription.id_inscription = invitation.id_inscription
      WHERE inscription.id_utilisateur = $1
        AND invitation.id_statut = 1
    `;
    const invitations = await pool.query(queryInvitations, [id_utilisateur]);

    res.json({
      inscriptions: inscriptions.rows,
      invitations: invitations.rows,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

// Crée une nouvelle inscription et les invitations associées
export async function createInscription(req, res) {
  const client = await pool.connect();
  try {
    const { invitations, message } = req.body;
    const { id_partie } = req.params;
    const id_utilisateur = req.id;
    const email = req.user.email;
    const userSurname = req.user.surname || req.user.name || "Utilisateur";
    const statutId = 1;

    if (!email) {
      return res.status(400).json({ error: "Email utilisateur manquant" });
    }
    if (!id_partie) {
      return res.status(400).json({ error: "ID de la partie manquant" });
    }
    if (!invitations || !Array.isArray(invitations)) {
      return res
        .status(400)
        .json({ error: "Invitations manquantes ou invalides" });
    }

    // Vérifie que la partie existe
    const existingTable = await client.query(
      `
      SELECT *
      FROM partie
      WHERE id_partie = $1
      `,
      [id_partie]
    );
    if (existingTable.rows.length === 0) {
      return res.status(404).json({ error: "Table non trouvée" });
    }
    const table = existingTable.rows[0];

    // Vérifie que l'utilisateur n'est pas déjà inscrit à cette partie
    const existingInscription = await client.query(
      `
      SELECT *
      FROM inscription
      WHERE id_partie = $1
        AND id_utilisateur = $2
      `,
      [id_partie, id_utilisateur]
    );
    if (existingInscription.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Vous êtes déjà inscrit à cette partie" });
    }

    // Vérifie qu'il reste assez de places
    const countInscriptions = await client.query(
      `
      SELECT COUNT(*)
      FROM inscription
      WHERE id_partie = $1
      `,
      [id_partie]
    );
    const nbrInscriptions = parseInt(countInscriptions.rows[0].count, 10);
    if (nbrInscriptions + invitations.length + 1 > table.nbr_places) {
      return res
        .status(400)
        .json({ message: "Il n'y a pas assez de places disponibles" });
    }

    await client.query("BEGIN");

    // Crée l'inscription
    const insertInscriptionQuery = `
      INSERT INTO inscription (
        id_partie,
        id_utilisateur,
        inscription_date,
        id_statut,
        note
      )
      VALUES ($1, $2, NOW(), $3, $4)
      RETURNING *
    `;
    const newInscription = await client.query(insertInscriptionQuery, [
      id_partie,
      id_utilisateur,
      statutId,
      message,
    ]);

    // Crée les invitations et envoie les emails
    for (const invitation of invitations) {
      const existingInvitationQuery = `
        SELECT *
        FROM invitation
        WHERE email = $1
          AND id_partie = $2
      `;
      const existingInvitation = await client.query(existingInvitationQuery, [
        invitation.email,
        id_partie,
      ]);
      if (existingInvitation.rows.length > 0) {
        res.status(400).json({
          message: `L'invitation pour ${invitation.email} existe déjà pour cette table.`,
        });
        await client.query("ROLLBACK");
        return;
      }
      const insertInvitationQuery = `
        INSERT INTO invitation (
          id_inscription,
          email,
          nom,
          id_statut,
          id_partie
        )
        VALUES ($1, $2, $3, $4, $5)
      `;
      await client.query(insertInvitationQuery, [
        newInscription.rows[0].id_inscription,
        invitation.email,
        invitation.nom,
        statutId,
        id_partie,
      ]);
      if (!invitation.email) {
        continue;
      }

      // Envoie un email d'invitation à chaque invité
      const html = htmlInscriptionConfirmation(
        invitation.nom,
        table.nom,
        formatDate(table.start_at),
        formatDate(table.end_at)
      );
      await sendEmail(invitation.email, "Invitation à une table", html);
    }

    // Envoie un email de confirmation d'inscription à l'utilisateur
    const html = htmlInscriptionConfirmation(
      userSurname,
      table.nom,
      formatDate(table.start_at),
      formatDate(table.end_at)
    );
    await sendEmail(email, "Confirmation d'inscription à une table", html);
    await client.query("COMMIT");
    res.status(201).json({ message: "Inscription créée avec succès" });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Erreur interne du serveur" });
  } finally {
    client.release();
  }
}

// Met à jour une inscription existante et les invitations associées
export async function updateInscription(req, res) {
  const { id } = req.params;
  const { statut, newInvitation } = req.body;
  const client = await pool.connect();
  try {
    // Vérifie que l'inscription existe
    const existingInscription = await client.query(
      `
      SELECT *
      FROM inscription
      JOIN invitation ON invitation.id_inscription = inscription.id_inscription
      JOIN utilisateur ON utilisateur.id_utilisateur = inscription.id_utilisateur
      JOIN role ON role.id_role = utilisateur.id_role
      WHERE inscription.id_inscription = $1
      `,
      [id]
    );
    if (existingInscription.rows.length === 0) {
      return res.status(404).json({ error: "Inscription non trouvée" });
    }
    // Vérifie que l'utilisateur est le propriétaire ou admin/mj
    if (
      existingInscription.rows[0].id_utilisateur !== req.id &&
      req.user.role_name !== "admin" &&
      req.user.role_name !== "mj"
    ) {
      return res.status(403).json({ error: "Accès refusé" });
    }
    // Vérifie que la partie existe
    const existingTableQuery = `
      SELECT *
      FROM partie
      WHERE id_partie = $1
    `;
    const existingTable = await client.query(existingTableQuery, [
      existingInscription.rows[0].id_partie,
    ]);
    if (existingTable.rows.length === 0) {
      return res.status(404).json({ error: "Table non trouvée" });
    }
    // Vérifie que le statut existe
    const existingStatutQuery = `
      SELECT *
      FROM statut
      WHERE designation = $1
    `;
    const existingStatut = await client.query(existingStatutQuery, [statut]);
    if (existingStatut.rows.length === 0) {
      return res.status(404).json({ error: "Statut non trouvé" });
    }
    const statutId = existingStatut.rows[0].id_statut;

    await client.query("BEGIN");
    // Met à jour le statut de l'inscription
    await client.query(
      `
      UPDATE inscription
      SET id_statut = $1
      WHERE id_inscription = $2
      `,
      [statutId, id]
    );
    const html = htmlInvitationCancellation(
      existingInscription.rows[0].surname,
      existingTable.rows[0].nom
    );
    if (statut === "Annulé") {
      // Envoie un mail pour l'annulation de l'inscription
      await sendEmail(
        existingInscription.rows[0].email,
        "Annulation d'inscription",
        html
      );
    }

    // Ajoute ou modifie les invitations existantes
    if (Array.isArray(newInvitation) && newInvitation.length > 0) {
      for (const invitation of newInvitation) {
        const existingInvitationQuery = `
          SELECT *
          FROM invitation
          WHERE nom = $1
            AND id_inscription = $2
        `;
        const existingInvitation = await client.query(existingInvitationQuery, [
          invitation.nom,
          id,
        ]);
        if (existingInvitation.rows.length > 0) {
          // Vérifie que le statut est valide
          const existingStatutQuery = `
            SELECT *
            FROM statut
            WHERE designation = $1
          `;
          const existingStatut = await client.query(existingStatutQuery, [
            invitation.statut,
          ]);
          if (existingStatut.rows.length === 0) {
            return res.status(404).json({
              error: "Statut non trouvé pour l'invitation  " + invitation.email,
            });
          }
          const invitationStatutId = existingStatut.rows[0].id_statut;
          // Met à jour l'invitation existante
          const updateInvitationQuery = `
            UPDATE invitation
            SET nom = $1,
                id_statut = $2,
                id_inscription = $3
            WHERE nom = $1
          `;
          await client.query(updateInvitationQuery, [
            invitation.nom,
            invitationStatutId,
            id,
          ]);
          const html = htmlInvitationCancellation(
            invitation.nom,
            existingTable.rows[0].nom
          );
          if (invitation.statut === "Annulé") {
            if (!invitation.email) {
              continue;
            }
            // Envoie un mail pour l'annulation de l'invitation
            await sendEmail(invitation.email, "Annulation d'invitation", html);
          }
          continue;
        }
        // Ajoute une nouvelle invitation
        const insertInvitationQuery = `
          INSERT INTO invitation (
            id_inscription,
            email,
            nom,
            id_statut
          )
          VALUES ($1, $2, $3, $4)
        `;
        await client.query(insertInvitationQuery, [
          id,
          invitation.email,
          invitation.nom,
          statutId,
        ]);
        // Envoie un email d'invitation à chaque invité
        const html = htmlInscriptionConfirmation(
          invitation.nom,
          existingInscription.rows[0].nom,
          formatDate(existingInscription.rows[0].start_at),
          formatDate(existingInscription.rows[0].end_at)
        );
        await sendEmail(invitation.email, "Invitation à une table", html);
      }
    }
    res.status(200).json({ message: "Inscription mise à jour avec succès" });
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Erreur interne du serveur" });
  } finally {
    client.release();
  }
}

// Supprime une inscription et les invitations associées
export async function deleteInscription(req, res) {
  const { id_partie } = req.params;
  const id = req.id;
  const email = req.user.email;
  const name = req.user.username || req.user.surname;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const existingTableQuery = `
      SELECT *
      FROM partie
      WHERE id_partie = $1
    `;
    const existingTable = await client.query(existingTableQuery, [id_partie]);
    if (existingTable.rows.length === 0) {
      return res.status(404).json({ error: "Table non trouvée" });
    }

    // Supprime l'inscription liée à l'utilisateur et la partie
    const queryDeleteInscription = `
      DELETE FROM inscription
      WHERE id_utilisateur = $1
        AND id_partie = $2
      RETURNING *
    `;
    const deleteInscription = await client.query(queryDeleteInscription, [id, id_partie]);

    // Envoie un email de confirmation de désinscription à l'utilisateur
    const html = htmlInvitationCancellation(
      name,
      existingTable.rows[0].nom
    );
    await sendEmail(email, "Désinscription", html);
    await client.query("COMMIT");
    res.status(200).json({ message: "Inscription supprimée avec succès" });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Erreur interne du serveur" });
  } finally {
    client.release();
  }
}

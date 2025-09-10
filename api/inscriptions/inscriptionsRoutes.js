import express from "express";
import {
  createInscription,
  getAllInscriptions,
  getInscriptionById,
  getInscriptionsByTable,
  updateInscription,
} from "./inscriptionsControllers.js";
import { verifyRoleMjOrAdmin } from "../utils/verifyRole.js";
import verifyToken from "../utils/verifyToken.js";

export const inscriptionRouter = express.Router();

// Récupérer toutes les inscriptions
inscriptionRouter.get("/", getAllInscriptions);

// Récupérer les inscriptions d'une table
inscriptionRouter.get(
  "/tables/:tableId",
  verifyToken,
  verifyRoleMjOrAdmin,
  getInscriptionsByTable
);

// Récupérer les inscriptions Valide d'une table

// Récupérer une inscription par ID
inscriptionRouter.get(
  "/:id",
  verifyToken,
  verifyRoleMjOrAdmin,
  getInscriptionById
);

// Créer une nouvelle inscription
inscriptionRouter.post("/create/:id_partie", verifyToken, createInscription);

// Mettre à jour une inscription existante
inscriptionRouter.put("/update/:id", verifyToken, updateInscription);

// Supprimer une inscription

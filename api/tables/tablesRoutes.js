import express from "express";

//Import des controllers
import {
  createTable,
  deleteTable,
  getAllTables,
  getMyTables,
  getMyTablesMj,
  getOneTable,
  updateTable,
} from "./tablesControllers.js";
import verifyToken from "../utils/verifyToken.js";
import { verifyRoleMjOrAdmin } from "../utils/verifyRole.js";

export const tablesRouter = express.Router();

export default tablesRouter;

//CRUD des tables de jeu de rôle (JDR)

//Récupérer les tables où je suis inscrit
tablesRouter.get("/mytables", verifyToken, getMyTables);

//Récupérer les tables où je suis MJ
tablesRouter.get("/mj", verifyToken, verifyRoleMjOrAdmin, getMyTablesMj);

//Récupérer 1 table avec id
tablesRouter.get("/:id", getOneTable);

//Récupérer toutes les tables
tablesRouter.get("/", getAllTables);

//Créer une table
tablesRouter.post("/create", verifyToken, verifyRoleMjOrAdmin, createTable);

//Modifier une table
tablesRouter.put("/update/:id", verifyToken, verifyRoleMjOrAdmin, updateTable);

//Supprimer une table
tablesRouter.delete(
  "/delete/:id",
  verifyToken,
  verifyRoleMjOrAdmin,
  deleteTable
);

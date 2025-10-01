import express from "express";
import verifyToken from "../utils/verifyToken.js";
import { verifyRoleMjOrAdmin } from "../utils/verifyRole.js";
import { getMjInfo } from "./userControllers.js";

export const userRouter = express.Router();

// Récupère les informations des MJ si l'utilisateur est MJ ou admin
userRouter.get("/mj", verifyToken, verifyRoleMjOrAdmin, getMjInfo);

import express from "express";
import verifyToken from "../utils/verifyToken.js";
import { verifyRoleMjOrAdmin } from "../utils/verifyRole.js";
import { getMjInfo } from "./userControllers.js";

export const userRouter = express.Router();

//Récupérer les informations des mj
userRouter.get("/mj", verifyToken, verifyRoleMjOrAdmin, getMjInfo);

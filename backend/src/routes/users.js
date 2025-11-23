import express from "express";
import { createUser, getMyUser } from "../controllers/usersController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Registrar usuario (necesita token)
router.post("/", authMiddleware, createUser);

// Obtener mi usuario (necesita token)
router.get("/me", authMiddleware, getMyUser);

export default router;

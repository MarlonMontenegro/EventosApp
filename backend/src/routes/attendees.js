import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  attendEvent,
  getAttendees,
  cancelAttendance,
} from "../controllers/attendeesController.js";

const router = express.Router();

// Obtener asistentes de un evento
router.get("/:id", authMiddleware, getAttendees);

// Confirmar asistencia
router.post("/:id/attend", authMiddleware, attendEvent);

// Cancelar asistencia
router.post("/:id/cancel", authMiddleware, cancelAttendance);

export default router;

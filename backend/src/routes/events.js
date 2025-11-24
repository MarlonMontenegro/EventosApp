import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createEvent,
  getEvents,
  getEventById,
  deleteEvent,
} from "../controllers/eventsController.js";

const router = express.Router();

router.post("/create", authMiddleware, createEvent);
router.get("/", authMiddleware, getEvents);

// Obtener 1 evento por id
router.get("/:id", authMiddleware, getEventById);

// Eliminar evento
router.delete("/:id", authMiddleware, deleteEvent);

export default router;

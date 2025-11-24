import express from "express";
import admin from "../config/firebaseAdmin.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
const db = admin.firestore();

// Obtener estadísticas generales
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Total de eventos
    const eventsSnapshot = await db.collection("events").get();
    const totalEvents = eventsSnapshot.size;

    // Total de comentarios
    let totalComments = 0;

    for (const eventDoc of eventsSnapshot.docs) {
      const commentsSnap = await eventDoc.ref.collection("comments").get();
      totalComments += commentsSnap.size;
    }

    // Eventos creados por el usuario actual
    const userEvents = eventsSnapshot.docs.filter(
      (d) => d.data().createdBy === req.user.email
    ).length;

    return res.json({
      success: true,
      stats: {
        totalEvents,
        totalComments,
        userEvents,
      },
    });
  } catch (error) {
    console.error("Error obteniendo stats:", error);
    res.status(500).json({
      success: false,
      error: "Error obteniendo estadísticas",
    });
  }
});

export default router;

import express from "express";
import admin from "../config/firebaseAdmin.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
const db = admin.firestore();

// Obtener comentarios de un evento
router.get("/:eventId", authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;

    const snapshot = await db
      .collection("events")
      .doc(eventId)
      .collection("comments")
      .orderBy("createdAt", "asc")
      .get();

    const comments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error("Error obteniendo comentarios:", error);
    res.status(500).json({
      success: false,
      error: "Error obteniendo comentarios",
    });
  }
});

// Agregar comentario
router.post("/:eventId", authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.json({
        success: false,
        error: "El comentario está vacío",
      });
    }

    const newComment = {
      text,
      createdBy: req.user.email,
      createdAt: admin.firestore.Timestamp.now(),
    };

    const docRef = await db
      .collection("events")
      .doc(eventId)
      .collection("comments")
      .add(newComment);

    return res.json({
      success: true,
      commentId: docRef.id,
    });
  } catch (error) {
    console.error("Error creando comentario:", error);
    res.status(500).json({
      success: false,
      error: "Error creando comentario",
    });
  }
});

export default router;

import admin from "firebase-admin";
import { dbAdmin } from "../config/firebaseAdmin.js";

export const attendEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { userId } = req.body; // UID del usuario que asistirá (puede venir del body)

    // También tomamos datos del token verificado por authMiddleware
    const authUser = req.user || {}; // { uid, email, ... }
    const uid = authUser.uid || userId;
    const email = authUser.email || null;

    if (!uid) {
      return res.status(400).json({
        success: false,
        error: "Falta userId o no se pudo obtener del token",
      });
    }

    const eventRef = dbAdmin.collection("events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res
        .status(404)
        .json({ success: false, error: "Evento no encontrado" });
    }

    // Guardar asistencia en subcolección attendees
    const attendeeRef = eventRef.collection("attendees").doc(uid);
    await attendeeRef.set({
      userId: uid,
      email: email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true, message: "Asistencia confirmada" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAttendees = async (req, res) => {
  try {
    const eventId = req.params.id;
    const eventRef = dbAdmin.collection("events").doc(eventId);
    const attendeesSnapshot = await eventRef.collection("attendees").get();

    const attendees = attendeesSnapshot.docs.map((doc) => doc.data());

    res.json({ success: true, attendees });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const cancelAttendance = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { userId } = req.body;

    if (!userId)
      return res.status(400).json({ success: false, error: "Falta userId" });

    const attendeeRef = dbAdmin
      .collection("events")
      .doc(eventId)
      .collection("attendees")
      .doc(userId);
    const attendeeDoc = await attendeeRef.get();

    if (!attendeeDoc.exists) {
      return res
        .status(404)
        .json({ success: false, error: "Asistencia no encontrada" });
    }

    await attendeeRef.delete();

    res.json({ success: true, message: "Asistencia cancelada correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const listUserEvents = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "Missing userId",
      });
    }

    // Buscar todos los eventos donde aparece este usuario en attendees
    const events = await db
      .selectFrom("events")
      .selectAll()
      .where("attendees", "@>", JSON.stringify([{ userId }]))
      .execute();

    return res.json({
      success: true,
      data: events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

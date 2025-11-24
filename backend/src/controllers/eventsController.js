import admin from "firebase-admin";
import { dbAdmin } from "../config/firebaseAdmin.js";

export const createEvent = async (req, res) => {
  try {
    const { title, description, type, subtype, date, location, createdBy } =
      req.body;

    // Creamos un nuevo documento en la colección 'events'
    const newEventRef = dbAdmin.collection("events").doc(); // crea un ID automáticamente
    await newEventRef.set({
      title,
      description,
      type,
      subtype,
      date: new Date(date), // convertimos a timestamp
      location,
      createdBy,
      createdAt: new Date(),
    });

    res.json({
      success: true,
      message: "Evento creado correctamente",
      eventId: newEventRef.id,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const eventsSnapshot = await dbAdmin
      .collection("events")
      .orderBy("date", "asc")
      .get();

    const events = eventsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const attendEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { userId } = req.body; // UID del usuario que asistirá

    if (!userId)
      return res.status(400).json({ success: false, error: "Falta userId" });

    const eventRef = dbAdmin.collection("events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res
        .status(404)
        .json({ success: false, error: "Evento no encontrado" });
    }

    // Guardamos el usuario en un array de asistentes
    await eventRef.update({
      attendees: admin.firestore.FieldValue.arrayUnion(userId),
    });

    res.json({ success: true, message: "Asistencia confirmada" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const listPastEvents = async (req, res) => {
  try {
    const eventsSnapshot = await dbAdmin.collection("events").get();
    const now = new Date();

    const pastEvents = eventsSnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date.toDate(), // Convertir Firestore Timestamp a Date
        };
      })
      .filter((event) => event.date < now)
      .sort((a, b) => b.date - a.date); // Ordenar de más reciente a más antiguo

    res.json({ success: true, events: pastEvents });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const listFutureEvents = async (req, res) => {
  try {
    const eventsSnapshot = await dbAdmin.collection("events").get();
    const now = new Date();

    const futureEvents = eventsSnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date.toDate(),
        };
      })
      .filter((event) => event.date >= now)
      .sort((a, b) => a.date - b.date); // Más próximos primero

    res.json({ success: true, events: futureEvents });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    const doc = await dbAdmin.collection("events").doc(eventId).get();

    if (!doc.exists) {
      return res
        .status(404)
        .json({ success: false, error: "Evento no encontrado" });
    }

    return res.json({
      success: true,
      event: { id: doc.id, ...doc.data() },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    await dbAdmin.collection("events").doc(eventId).delete();

    return res.json({
      success: true,
      message: "Evento eliminado correctamente",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

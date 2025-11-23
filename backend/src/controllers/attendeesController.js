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

    // Guardar asistencia en subcolección attendees
    const attendeeRef = eventRef.collection("attendees").doc(userId);
    await attendeeRef.set({
      userId,
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

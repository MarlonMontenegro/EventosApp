import admin from "../config/firebaseAdmin.js";
const db = admin.firestore();

/**
 * Registrar o crear usuario en Firestore
 * Se llama una sola vez después del login con Firebase
 */
export const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const uid = req.user.uid; // viene del token

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: "Faltan campos obligatorios (name, email)",
      });
    }

    await db.collection("users").doc(uid).set(
      {
        uid,
        name,
        email,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    res.json({ success: true, message: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Obtener los datos del usuario logueado
 */
export const getMyUser = async (req, res) => {
  try {
    const uid = req.user.uid;

    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Usuario no encontrado",
      });
    }

    res.json({
      success: true,
      user: userDoc.data(),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

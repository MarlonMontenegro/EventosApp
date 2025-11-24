import admin from "../config/firebaseAdmin.js";

/**
 * authMiddleware mejorado
 * - Verifica el token
 * - Siempre adjunta uid + email reales
 */
export const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Token requerido",
      });
    }

    const token = header.split(" ")[1];

    // 1) Verificar token
    const decoded = await admin.auth().verifyIdToken(token);

    let uid = decoded.uid;
    let email = decoded.email || null;

    // 2) Si Firebase NO manda el email → traerlo desde la base de usuarios
    if (!email) {
      const userRecord = await admin.auth().getUser(uid);
      email = userRecord.email || null;
    }

    // 3) Guardarlo en req.user
    req.user = {
      uid,
      email,
    };

    next();
  } catch (err) {
    console.error("authMiddleware error:", err);
    return res.status(401).json({
      success: false,
      error: "Token inválido",
    });
  }
};

import admin from "../config/firebaseAdmin.js";

/**
 * authMiddleware
 * - Lee el header Authorization: Bearer <ID_TOKEN>
 * - Verifica el token con firebase-admin
 * - Si es válido pone req.user = decodedToken (contiene uid, email, etc.)
 * - Si no es válido devuelve 401
 */
export const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "Token requerido" });
    }

    const token = header.split(" ")[1];

    // verifica token con firebase-admin
    const decoded = await admin.auth().verifyIdToken(token);

    // Attach user info to request
    req.user = decoded; // decoded.uid, decoded.email, etc.

    return next();
  } catch (err) {
    return res.status(401).json({ success: false, error: "Token inválido" });
  }
};

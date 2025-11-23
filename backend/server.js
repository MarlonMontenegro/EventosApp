import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Importar routers
import eventsRoutes from "./src/routes/events.js";
import attendeesRoutes from "./src/routes/attendees.js";
import { authMiddleware } from "./src/middlewares/authMiddleware.js";
import usersRoutes from "./src/routes/users.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas
app.use("/api/events", authMiddleware, eventsRoutes);
app.use("/api/attendees", authMiddleware, attendeesRoutes);
app.use("/api/users", usersRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API funcionando correctamente" });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

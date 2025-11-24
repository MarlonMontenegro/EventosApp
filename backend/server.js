import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Importar routers
import eventsRoutes from "./src/routes/events.js";
import attendeesRoutes from "./src/routes/attendees.js";
import usersRoutes from "./src/routes/users.js";
import commentsRoutes from "./src/routes/comments.js";
import statsRoutes from "./src/routes/stats.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas (sin auth global)
app.use("/api/events", eventsRoutes);
app.use("/api/attendees", attendeesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/stats", statsRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API funcionando correctamente" });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

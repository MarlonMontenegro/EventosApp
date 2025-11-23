import express from "express";
import {
  attendEvent,
  getAttendees,
} from "../controllers/attendeesController.js";

const router = express.Router();

router.post("/confirm/:id", attendEvent);
router.get("/:id", getAttendees);
router.delete("/cancel/:id", cancelAttendance);

export default router;

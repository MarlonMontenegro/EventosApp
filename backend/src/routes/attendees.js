import express from "express";
import {
  attendEvent,
  getAttendees,
  cancelAttendance,
  listUserEvents,
} from "../controllers/attendeesController.js";

const router = express.Router();

router.post("/confirm/:id", attendEvent);
router.get("/:id", getAttendees);
router.delete("/cancel/:id", cancelAttendance);
router.get("/user/:userId", listUserEvents);

export default router;

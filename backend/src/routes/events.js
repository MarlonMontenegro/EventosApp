import express from "express";
import {
  createEvent,
  getEvents,
  attendEvent,
} from "../controllers/eventsController.js";

const router = express.Router();

router.post("/create", createEvent);
router.get("/", getEvents);
router.post("/:id/attend", attendEvent);
router.get("/past", listPastEvents);
router.get("/future", listFutureEvents);

export default router;

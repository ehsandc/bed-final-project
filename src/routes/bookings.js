import express from "express";
import * as bookingService from "../services/bookingService.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", bookingService.getAllBookings);
router.post("/", authenticateToken, bookingService.createBooking);
router.get("/:id", bookingService.getBookingById);
router.put("/:id", authenticateToken, bookingService.updateBooking);
router.delete("/:id", authenticateToken, bookingService.deleteBooking);

export default router;

import express from "express";
import * as reviewService from "../services/reviewService.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", reviewService.getAllReviews);
router.post("/", authenticateToken, reviewService.createReview);
router.get("/:id", reviewService.getReviewById);
router.put("/:id", authenticateToken, reviewService.updateReview);
router.delete("/:id", authenticateToken, reviewService.deleteReview);

export default router;

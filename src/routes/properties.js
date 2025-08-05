import express from "express";
import * as propertyService from "../services/propertyService.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", propertyService.getAllProperties);
router.post("/", authenticateToken, propertyService.createProperty);
router.get("/:id", propertyService.getPropertyById);
router.put("/:id", authenticateToken, propertyService.updateProperty);
router.delete("/:id", authenticateToken, propertyService.deleteProperty);

export default router;

import express from "express";
import * as hostService from "../services/hostService.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", hostService.getAllHosts);
router.post("/", authenticateToken, hostService.createHost);
router.get("/:id", hostService.getHostById);
router.put("/:id", authenticateToken, hostService.updateHost);
router.delete("/:id", authenticateToken, hostService.deleteHost);

export default router;

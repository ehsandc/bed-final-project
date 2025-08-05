import express from "express";
import * as userService from "../services/userService.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", userService.getAllUsers);
router.post("/", userService.createUser);
router.get("/:id", userService.getUserById);
router.put("/:id", authenticateToken, userService.updateUser);
router.delete("/:id", authenticateToken, userService.deleteUser);

export default router;

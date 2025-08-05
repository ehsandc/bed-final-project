import express from "express";
import { login } from "../services/authService.js";

const router = express.Router();

router.post("/", login);

export default router;

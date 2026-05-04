import { registerUser , loginUser } from "../src/controllers/authControllers.js";
import {protect} from "../src/middleware/authMiddleware,js"

import express from "express";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", protect, loginUser)

export default router;
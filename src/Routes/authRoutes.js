import { registerUser , loginUser } from "../controllers/authControllers.js";
import {protect} from "../middleware/authMiddleware.js"

import express from "express";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser)

export default router;
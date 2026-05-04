import { getProfile } from "../controllers/profileController.js";

import { protect } from "../middleware/authMiddleware.js";

import express from "express";


const router = express.Router();

router.get("/profile", protect, getProfile);

export default router;
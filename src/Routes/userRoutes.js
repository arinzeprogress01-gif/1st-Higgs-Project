import { getProfile } from "../src/controllers/profileControllers";

import { protect } from "../src/middleware/authMiddleware.js";

import express from "express";




const router = express.Router();

router.get("/profile", protect, getProfile);

export default router;
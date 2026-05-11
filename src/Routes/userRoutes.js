import { getProfile, updateProfile } from "../controllers/profileController.js";

import { protect } from "../middleware/authMiddleware.js";

import express from "express";


const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile/update", protect, updateProfile);
export default router;
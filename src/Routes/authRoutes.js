import { registerUser , loginUser } from "../controllers/authControllers.js";
import { resetPassword, changePassword, logoutUser } from "../controllers/authControllers.js";

import { protect } from "../middleware/authMiddleware.js";


import express from "express";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.put("/reset-password", resetPassword);

router.put(
    "/change-password",
    protect,
    changePassword
);

router.post("/logout", logoutUser);

export default router;
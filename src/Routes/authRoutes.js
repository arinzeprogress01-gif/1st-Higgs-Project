import { registerUser , loginUser } from "../controllers/authControllers.js";
import { resetPassword, logoutUser } from "../controllers/authControllers.js";


import express from "express";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.put("/reset-password", resetPassword);

router.post("/logout", logoutUser);

export default router;
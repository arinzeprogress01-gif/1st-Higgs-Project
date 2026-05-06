import { registerUser , loginUser } from "../controllers/authControllers.js";
import { resetPassword } from "../controllers/authControllers.js";


import express from "express";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.put("/reset-password", resetPassword);
export default router;
import { registerUser } from "../src/controllers/authControllers";

import express from "express";

const router = express.Router();

router.post("/register", registerUser);

export default router;
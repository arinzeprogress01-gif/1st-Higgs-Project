import { createTask, getTasks, updateTask, deleteTask, getTaskHistory } from "../controllers/taskController.js";

import { protect } from "../middleware/authMiddleware.js";

import express from "express";
const router = express.Router();

router.post("/create", protect, createTask);
router.get("/list", protect, getTasks);
router.put("/update/:id", protect, updateTask);
router.delete("/delete/:id", protect, deleteTask);

router.get("/history", protect, getTaskHistory);
export default router;
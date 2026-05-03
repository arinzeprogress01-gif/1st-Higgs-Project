import express from "express"
import cors from "cors"
import connectDB from "./src/config/db.js"

import authRoutes from "./src/Routes/authRoutes.js"
import userRoutes from "./src/Routes/userRoutes.js"

const app = express()

connectDB()

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.get("/app", (_req, res) => {
    res.json({
        message: " WE ARE LIVE!"
    })
});

export default app;
 
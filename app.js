import express from "express";
import cors from "cors";

import authRoutes from "./src/Routes/authRoutes.js";
import userRoutes from "./src/Routes/userRoutes.js";
import taskRoutes from "./src/Routes/taskRoutes.js";

const app = express();

app.use(cors({

    origin: "https://1st-higgs-project.vercel.app",
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/task", taskRoutes);

app.get("/app", (_req, res) => {
    res.json({
        message: " WE ARE LIVE!"
    })
});

export default app;
 
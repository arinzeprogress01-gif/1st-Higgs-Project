import express from "express";
import cors from "cors";

import authRoutes from "./src/Routes/authRoutes.js";
import userRoutes from "./src/Routes/userRoutes.js";
import taskRoutes from "./src/Routes/taskRoutes.js";

const app = express();

app.use(cors({

    origin: [

        "http://127.0.0.1:5500",

        "http://localhost:5500",

        "https://yourfrontend.vercel.app",

        "https://yourfrontend.netlify.app"
    ],

    methods: [
        "GET",
        "POST",
        "PUT",
        "DELETE"
    ],

    credentials: true
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
 
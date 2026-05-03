import express from "express"
import cors from "cors"
import connectDB from "./src/config/db.js"

const app = express()

//connectDB()

app.use(cors());

app.use(express.json());

app.get("/app", (_req, res) => {
    res.json({
        message: " WE ARE LIVE!"
    })
});

export default app;
 
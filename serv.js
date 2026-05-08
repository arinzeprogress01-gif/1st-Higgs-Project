import app from "./app.js";
import { config } from "dotenv"
import connectDB from "./src/config/db.js";

config()

connectDB();

if (typeof process.env.PORT !== "undefined") {
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`APP RUNNING ON PORT ${PORT}`);
    });
} else {
    const PORT = 8080; // Default to port 8080 if PORT is not defined
    app.listen(PORT, () => {
        console.log(`APP RUNNING ON PORT ${PORT}`);
    });
} // Default to port 8080 if PORT is not defined
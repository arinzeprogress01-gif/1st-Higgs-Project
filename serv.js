import app from "./app.js";
import { config } from "dotenv"

config()

if (typeof process.env.PORT !== "undefined") {
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`APP RUNNING ON PORT ${PORT}`);
    });
} else {
    const PORT = 5001; // Default to port 5001 if PORT is not defined
    app.listen(PORT, () => {
        console.log(`APP RUNNING ON PORT ${PORT}`);
    });
} // Default to port 5001 if PORT is not defined
import mongoose from "mongoose";

const connectDB = async () => {
    try{
        const conn = await mongoose.connect (process.env.MONGO_URI)

        console.log(`
            MongoDB connecting...
            MongoDB connecting...
            MongoDB connecting...
            MongoDB Connected: ${conn.connection.host}`);


    } catch (error) {
        console.error("DATABASE CONNECTION ERROR", error.message);
        process.exit(1);
    }
};

export default connectDB;
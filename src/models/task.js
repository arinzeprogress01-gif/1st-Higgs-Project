import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        task: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 50,
        },

        description: {
            type: String,
            minLength: 5,
            maxLength: 200,
        },

        status: {
            type: String,
            enum: ["pending", "completed", "overdue"],
            default: "pending",
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            required: true,
        },

        dueDate: {
            type: Date,
        },

        completedAt: {
            type: Date,
        },

    },
    {
        timestamps: true,
    }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
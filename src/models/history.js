import mongoose from "mongoose";

const taskHistorySchema = new mongoose.Schema({

    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    action: {
        type: String,
        enum: ["created", "updated", "deleted", "completed"],
        required: true,
    },

    changes: {
        type: Object, // what changed (flexible)
        default: {},
    },

    performedAt: {
        type: Date,
        default: Date.now,
    }

}, {
    timestamps: true
});

const TaskHistory = mongoose.model("TaskHistory", taskHistorySchema);

export default TaskHistory;
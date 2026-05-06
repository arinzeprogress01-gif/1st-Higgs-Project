import Task from "../models/task.js";
import TaskHistory from "../models/history.js";
import { timeAgo } from "../utils/timeAgo.js";

export const createTask = async (req, res) => {
    try {
        const { task, description, priority } = req.body;

        if (!task || !description || !priority) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newTask = await Task.create({
            user: req.user.id,
            task,
            description,
            priority,
        });

        await TaskHistory.create({
            task: newTask._id,
            user: req.user.id,
            action: "created",
        });

        res.status(201).json(newTask);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });

        const now = new Date();

        const formattedTasks = tasks.map(task => {
            const taskObj = task.toObject();

            return {
                ...taskObj,
                age: timeAgo(task.createdAt),
                isOverdue:
                    task.dueDate &&
                    task.dueDate < now &&
                    task.status !== "completed",
            };
        });

        res.json(formattedTasks);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const { task: title, description, priority, status, dueDate } = req.body;

        const changes = {};
ly
        if (title && title !== task.task) {
            changes.task = { from: task.task, to: title };
            task.task = title;
        }

        if (description && description !== task.description) {
            changes.description = { from: task.description, to: description };
            task.description = description;
        }

        if (priority && priority !== task.priority) {
            changes.priority = { from: task.priority, to: priority };
            task.priority = priority;
        }

        if (dueDate && new Date(dueDate).getTime() !== new Date(task.dueDate).getTime()) {
            changes.dueDate = { from: task.dueDate, to: dueDate };
            task.dueDate = dueDate;
        }

        if (status && status !== task.status) {
            changes.status = { from: task.status, to: status };
            task.status = status;

            if (status === "completed") {
                task.completedAt = new Date();
            }

            if (status !== "completed") {
                task.completedAt = null;
            }
        }

        if (Object.keys(changes).length === 0) {
            return res.status(400).json({ message: "No changes detected" });
        }

        const updatedTask = await task.save();

        await TaskHistory.create({
            task: updatedTask._id,
            user: req.user.id,
            action: "updated",
            changes,
        });

        res.json(updatedTask);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        };

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        await task.deleteOne();

        res.json({ message: "Task deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTaskHistory = async (req, res) => {
    try {
        const { days } = req.query;

        let filter = { user: req.user.id };

        if (days) {
            const date = new Date();
            date.setDate(date.getDate() - Number(days));

            filter.performedAt = { $gte: date };
        }

        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Number(req.query.limit) || 10, 50);

        const skip = (page - 1) * limit;

        const total = await TaskHistory.countDocuments(filter);

        const history = await TaskHistory.find(filter)
            .sort({ performedAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            data: history,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
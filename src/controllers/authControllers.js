import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import generateDiaryId from "../utils/generateDairyId.js";
import User from "../models/user.js"


export const registerUser = async (req, res) => {
    try {

        const { name, email, password, confirmPassword, category  } = req.body;

        if (!name || !email || !password || !confirmPassword || !category) {
            return res.status(400).send({
                "message" : " All Fields are Required"
            })
        };

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        };

        const userExists = await User.findOne({email});

        if (userExists)  {
            return res.status(400).json({
                message: " User Account Already Exists"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let categoryValue;

        if ( category === "personal" || category === "professional" || category === "todo-List") {
            categoryValue = category;
        };

        let diaryId = undefined;

        if (categoryValue === "personal") {
            diaryId = generateDiaryId("PER");
        } else if (categoryValue === "professional") {
            diaryId = generateDiaryId("PRO");
        } else if (categoryValue === "todo-List") {
            diaryId = generateDiaryId("TOD");
        };

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            systemType: categoryValue,
            DiaryId: diaryId,
            createdAt: new Date(),
        });

        res.status(201).json({
            message: "User Account Registered Successfully , Go To Email To Activate Account !",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                systemType: user.systemType,
                DiaryId: user.DiaryId
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error : Registration Failed",
            error: error.message
        })
    }
};

export const loginUser = async (req, res) => {
    try{

        const { email, password} = req.body

        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({
                message: " Credentials Do not Match this User"
            })
        };

        const isMatch = await bcrypt.compare (password, user.password)

        if (!isMatch) {
            return res.status(404).json({
                message: " Password Do Not Match"
            })
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                name: user.name,
                email: user.email,
                DiaryId: user.DiaryId,
                category: user.category,
            },
        });

    }catch (error) {
        res.status(500).json({message : error.message})
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmNewPassword } = req.body;

        if (!email || !newPassword || !confirmNewPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

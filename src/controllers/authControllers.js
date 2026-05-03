import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import generateDiaryId from "../src/utils/generateDairyId.js";
import User from "..src/models/user.js"


export const registerUser = async (req, res) => {
    try {

        const { name, email, password, confirmPassword, category  } = req.body;

        if (!name || !email || !password || !confirmPassword || category) {
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

        if ( category === "personal" || category === "professional" || category === "todo_list") {
            categoryValue = category;
        };

        let DairyId;

        if (categoryValue === "personal") {
            DairyId = generateDiaryId("PER");
        } else if (categoryValue === "professional") {
            DairyId = generateDiaryId("PRO");
        } else if (categoryValue === "todo_list") {
            DairyId = generateDiaryId("TOD");
        };

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            category: categoryValue,
            DairyId,
            createdAt: new Date(),
        });

        res.status(201).json({
            message: "User Account Registered Successfully , Go To Email To Activate Account !",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                category: user.category,
                DairyId: user.DairyId
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error : Registration Failed",
            error: error.message
        })
    }
};
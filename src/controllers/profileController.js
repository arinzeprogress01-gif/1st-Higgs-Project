import User from "../models/user.js";

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User Profile Not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


export const updateProfile =
    async (req, res) => {

        try {

            const user =
                await User.findById(
                    req.user.id
                );

            if (!user) {

                return res.status(404)
                    .json({
                        message:
                            "User not found"
                    });
            }

            const {
                name,
                email
            } = req.body;

            if (name)
                user.name = name;

            if (email)
                user.email = email;

            await user.save();

            res.json({

                message:
                    "Profile updated successfully",

                user: {

                    name:
                        user.name,

                    email:
                        user.email,

                    systemType:
                        user.systemType,

                    DiaryId:
                        user.DiaryId
                }
            });

        } catch (error) {

            res.status(500).json({
                message:
                    error.message
            });
        }
    };
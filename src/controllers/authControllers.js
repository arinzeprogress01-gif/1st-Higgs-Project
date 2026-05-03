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

        


    }catch{

    }
};
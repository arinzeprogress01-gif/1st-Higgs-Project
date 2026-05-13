import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

    name : {
        type: String,
        required: true,
        minlength: 4,
        maxLength: 30,
        match: [
            /^[a-zA-Z\s'-]+$/,
            "Name can only contain letters, spaces, hyphens and apostrophes"
        ]
    },

    email : {
        type : String,
        required : true,
        unique : true,
        match: [
            /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
            "Please fill a valid email address"
        ]
    },

    password : {
        type : String,
        required : true,
        minlength: 8,
        maxLength: 128,
    },

    systemType: {
        type: String,
        enum: ["personal", "professional", "todo-List"],
        default: null,
    },

    DiaryId: {
        type: String,
        unique: true,
    },

},
    
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", UserSchema);

export default User;
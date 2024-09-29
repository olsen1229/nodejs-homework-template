import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true, //this means the value must be unique or not duplicate within the entire collection
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],// enum is a data type which you can think of as a collection of relevant data
        default: "starter"
    },
    token: {
        type: String,
        default: null,
    },
    avatarUrl: {
        type: String, // field tot store the URL of the user's avatar
    },
    verify: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        required: [true, "Verify token is required"],
    },
},
    {versionKey: false}
);

const User = mongoose.model("user", userSchema);

export { User };
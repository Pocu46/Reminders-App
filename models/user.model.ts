import mongoose, { Schema } from "mongoose";
import { IUser } from "../utils/types";

const userSchema = new Schema({
    email: {
        type: String,
        unique: [true, 'Email already exists!'],
        required: [true, 'Email is required for DB.'],
    },
    password: {
        type: String,
        required: [true, 'Password is required for DB.'],
    },
    // image: {
    //     // type: String
    //     imageName: {type: String},
    //     imageLink: {type: String},
    // },
}, {
    timestamps: true
})

const User = mongoose.model<IUser>('User', userSchema)

export default User;
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
    //     imageName: {type: String},
    //     imageLink: {type: String},
    //     // required: [true, 'Image is required']
    // }
    image: {
        type: {
            imageName: {type: String},
            imageLink: {type: String},
        },
        required: [true, 'Image is required']
    }
}, {
    timestamps: true
})

const User = mongoose.model<IUser>('User', userSchema)

export default User;
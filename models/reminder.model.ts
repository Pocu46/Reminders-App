import mongoose, { Schema } from "mongoose";
import {IReminder} from "../utils/types";

const reminderSchema = new Schema<IReminder>({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    text: {
        type: String,
        required: [true, 'Text is required']
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator ID is required']
    }
}, {
    timestamps: true
})

const Reminder = mongoose.model<IReminder>('Reminder', reminderSchema);

export default Reminder;
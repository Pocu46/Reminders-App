import mongoose, { Schema, Document } from "mongoose";

export interface IReminder extends Document {
    title: string;
    text: string;
    creator: mongoose.Types.ObjectId;
}

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
});

const ReminderModel = mongoose.model<IReminder>('ReminderModel', reminderSchema);

export default ReminderModel;
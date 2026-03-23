import mongoose, { Document } from 'mongoose';

export interface IReminder extends Document {
    title: string;
    text: string;
    creator: mongoose.Types.ObjectId | string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUser {
    _id: mongoose.Types.ObjectId | string;
    id?: string;
    email: string;
    password: string;
    image: {
        imageName: string,
        imageLink: string
    };
    createdAt: Date;
    updatedAt: Date;
}

export type CreateReminderBody = {
    title: string;
    text: string;
}

export type reminderDB = {
    _id: string | mongoose.Types.ObjectId;
    title: string;
    text: string;
    creator: string | mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export type transformedReminder = {
    id: string;
    title: string;
    text: string;
    creator: string | mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export type CreateReminderSuccessResponse = {
    success: true;
    message: string;
}

export type CreateReminderErrorResponse = {
    success: false;
    message: string;
    errors?: any[];
}

export type GetRemindersSuccessResponse = {
    success: true;
    message: string;
    reminders: transformedReminder[];
}

export type GetReminderSuccessResponse = {
    success: true;
    message: string;
    reminder: transformedReminder;
}

export type GetReminderErrorResponse = {
    success: false;
    message: string;
}

export type EditReminderSuccessResponse = {
    success: true;
    message: string;
}

export type EditReminderErrorResponse = {
    success: false;
    message: string;
}

export type EditReminderValidationErrorResponse = {
    message: string;
    errors: any[];
}

export type DeleteReminderSuccessResponse = {
    success: true;
    message: string;
}

export type DeleteReminderErrorResponse = {
    success: false;
    message: string;
}

export type CreateUser = {
    email: string;
    password: string;
    confirmPassword: string;
}

export type UserLogin = {
    email: string;
    password: string;
}

export type UserFromDB = {
    _id: mongoose.Types.ObjectId;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export type TransformedUser = {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export type GetUserDataSuccessResponse = {
    success: boolean;
    message: string;
    user: TransformedUser
}
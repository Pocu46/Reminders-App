import { Request } from 'express';
import mongoose, { Document } from 'mongoose';

export type CreateReminderBody = {
    title: string;
    text: string;
}

export interface IReminder extends Document {
    title: string;
    text: string;
    creator: mongoose.Types.ObjectId | string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IAuthRequest extends Request {
    userId: string;
}

export type transformedReminder = {
    id: string;
    title: string;
    text: string;
    creator: string | mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
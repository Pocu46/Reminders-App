import { Request } from 'express';
import mongoose, { Document } from 'mongoose';

// export interface IReminder extends Document {
//     userId: string,
//     title: string;
//     text: string;
//     createdAt: Date;
//     updatedAt: Date;
// }

export interface IReminder extends Document {
    title: string;
    text: string;
    creator: mongoose.Types.ObjectId | string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IAuthRequest extends Request {
    userId?: string;
}
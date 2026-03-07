import mongoose from 'mongoose';
import {Request, Response, NextFunction} from 'express';
import {IAuthRequest, IReminder} from "../utils/types";
import {validationResult} from "express-validator";
import Reminder from "../models/reminder.model";

// type CreateReminderParams = {
//     userId: string;
// }

type CreateReminderBody = {
    title: string;
    text: string;
}

export const createReminder = async (req: Request<{}, {}, CreateReminderBody>, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({success: false, message: 'Validation failed, entered data is incorrect.', errors: errors.array()})
    }

    const userId = '123'
    const { title, text } = req.body

    const reminder = new Reminder({
        title,
        text,
        creator: userId
    })
    try {
        await reminder.save()

        res.status(201).json({success: true, message: 'New Reminder created'})
    } catch (error) {
        console.error('Error creating reminder:', error);

        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const getReminders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reminders = await Reminder.find().sort('-createdAt').lean()
        res.status(200).json({message: 'Fetched Reminders successfully.', reminders})
    } catch (error) {
        const err = error as Error & {statusCode?: number}
        if(!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}

export const getReminder = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    const reminderId  = req.params?.id

    try {
        const existingReminder = await Reminder.findOne({_id: reminderId})
        if(!existingReminder) {
            const error = new Error('Could not find reminder.') as Error & { statusCode?: number }
            error.statusCode = 404
            throw error
        }
        res.status(200).json({message: 'Reminder fetched', reminder: existingReminder})
    } catch (error) {
        const err = error as Error & { statusCode?: number }

        if(!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}

export const editReminder = async (req: IReminder, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({message: 'Validation failed, entered data is incorrect.', errors: errors.array()})
    }

    // const { id, title, text } = req.body

    // const editedReminder = new ReminderModel({
    //     title,
    //     text,
    //     creator: id
    // })
    try {
        // find reminder by ID

        // await editedReminder.save()    // reminder = editedReminder

        res.status(200).json({message: 'ReminderModel was edited'})
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(422).json({
                message: 'Validation failed',
                errors: Object.values(error.errors).map(e => e.message)
            })
        }
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({
                message: 'Invalid data format'
            })
        }

        console.error('Editing reminder Error: ', error);

        return res.status(500).json({
            message: 'Something went wrong. Please try again later.'
        })
    }
}

export const deleteReminder = (req: Request, res: Response) => {
    console.log('Delete  ReminderModel')
}
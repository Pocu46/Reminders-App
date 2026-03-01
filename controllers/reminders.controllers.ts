import mongoose from 'mongoose';
import { Request, Response } from 'express';
import {validationResult} from "express-validator";
import {Reminder} from "../utils/types";
import ReminderModel from "../models/reminder.model";

export const createReminder = async (req: Request<Reminder>, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({message: 'Validation failed, entered data is incorrect.', errors: errors.array()})
    }

    const { id, title, text } = req.body

    const reminder = new ReminderModel({
        title,
        text,
        creator: id
    })
    try {
        await reminder.save()

        res.status(201).json({message: 'New Reminder created'})
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

        console.error('Creating reminder Error: ', error);

        return res.status(500).json({
            message: 'Something went wrong. Please try again later.'
        })
    }
}

export const getReminders = (req: Request, res: Response) => {
    res.status(200).json({reminders: []})
}

export const getReminder = (req: Request, res: Response) => {
    console.log('Download ReminderModel by ID')
}

export const editReminder = (req: Request<Reminder>, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({message: 'Validation failed, entered data is incorrect.',errors: errors.array()})
    }

    const title: string = req.body?.title
    const text: string = req.body?.text

    res.status(200).json({message: 'ReminderModel was edited'})
}

export const deleteReminder = (req: Request, res: Response) => {
    console.log('Delete  ReminderModel')
}
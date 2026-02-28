import { Request, Response } from 'express';
import {validationResult} from "express-validator";

export const createReminder = (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({message: 'Validation failed, entered data is incorrect.',errors: errors.array()})
    }

    const title: string = req.body?.title
    const text: string = req.body?.text

    res.status(201).json({message: 'Reminder created'})
}

export const getReminders = (req: Request, res: Response) => {
    res.status(200).json({reminders: []})
}

export const getReminder = (req: Request, res: Response) => {
    console.log('Download Reminder by ID')
}

export const editReminder = (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({message: 'Validation failed, entered data is incorrect.',errors: errors.array()})
    }

    const title: string = req.body?.title
    const text: string = req.body?.text

    res.status(200).json({message: 'Reminder was edited'})
}

export const deleteReminder = (req: Request, res: Response) => {
    console.log('Delete  Reminder')
}
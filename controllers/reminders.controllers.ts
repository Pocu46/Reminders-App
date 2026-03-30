import {Request, Response, NextFunction} from "express";
import {
    CreateReminderBody,
    transformedReminder,
    CreateReminderSuccessResponse,
    CreateReminderErrorResponse,
    GetRemindersSuccessResponse,
    GetReminderSuccessResponse,
    GetReminderErrorResponse,
    EditReminderSuccessResponse,
    EditReminderErrorResponse,
    EditReminderValidationErrorResponse,
    DeleteReminderSuccessResponse,
    DeleteReminderErrorResponse, reminderDB, HttpError
} from "../utils/types";
import {validationResult} from "express-validator";
import Reminder from "../models/reminder.model";

export const createReminder = async (req: Request<{}, {}, CreateReminderBody>, res: Response<CreateReminderSuccessResponse | CreateReminderErrorResponse>, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({success: false, message: 'Validation failed, entered data is incorrect.', errors: errors.array()})
    }

    const userId = '69b18a76eed1d10cfaa7a873'
    const { title, text } = req.body

    const reminder = new Reminder({
        title,
        text,
        creator: userId
    })
    try {
        await reminder.save()

        res.status(201).json({success: true, message: 'New Reminder created'})
    } catch (error: unknown) {
        const err = error as HttpError
        if(!err.statusCode) {
            err.statusCode = 500
            err.success = false
        }
        next(err)
    }
}

export const getReminders = async (req: Request, res: Response<GetRemindersSuccessResponse>, next: NextFunction) => {
    const userId = '123'
    try {
        const reminders: reminderDB[] = await Reminder.find({creator: userId}).sort('-createdAt').lean()

        const transformedReminders: transformedReminder[] = reminders.map(reminder => ({
            id: reminder._id.toString(),
            title: reminder.title,
            text: reminder.text,
            creator: reminder.creator,
            createdAt: reminder.createdAt,
            updatedAt: reminder.updatedAt
        }))

        res.status(200).json({success: true, message: 'Fetched Reminders successfully.', reminders: transformedReminders})
    } catch (error: unknown) {
        const err = error as HttpError
        if(!err.statusCode) {
            err.statusCode = 500
            err.success = false
        }
        next(err)
    }
}

export const getReminder = async (req: Request<{reminderId: string}, {}, {}>, res: Response<GetReminderSuccessResponse | GetReminderErrorResponse>, next: NextFunction) => {
    const userId = '123'

    const reminderId= req.params?.reminderId

    if(!reminderId) {
        return res.status(400).json({success: false, message: 'Reminder ID required.'})
    }

    try {
        const existingReminder: reminderDB | null = await Reminder.findOne({_id: reminderId, creator: userId})
        if(!existingReminder) {
            return res.status(404).json({success: false, message: 'Reminder doesn\'t found.'})
        }

        const transformedReminder: transformedReminder = {
            id: existingReminder._id.toString(),
            title: existingReminder.title,
            text: existingReminder.text,
            creator: existingReminder.creator,
            createdAt: existingReminder.createdAt,
            updatedAt: existingReminder.updatedAt
        }

        res.status(200).json({success: true, message: 'Reminder fetched', reminder: transformedReminder})
    } catch (error: unknown) {
        const err = error as HttpError
        if(!err.statusCode) {
            err.statusCode = 500
            err.success = false
        }
        next(err)
    }
}

export const editReminder = async (req: Request<{reminderId: string}, {}, CreateReminderBody>, res: Response<EditReminderSuccessResponse | EditReminderErrorResponse | EditReminderValidationErrorResponse>, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({message: 'Validation failed, entered data is incorrect.', errors: errors.array()})
    }

    const userId = '123'
    const reminderId  = req.params.reminderId
    const { title, text } = req.body

    if(!reminderId) {
        return res.status(400).json({success: false, message: 'Reminder ID required.'})
    }

    const editedReminder = {
        title,
        text,
        updatedAt: new Date()
    }
    try {
        const reminder = await Reminder.findOneAndUpdate(
            { _id: reminderId, creator: userId },
            { $set: editedReminder },
            { returnDocument: 'after', runValidators: true }
        )

        if(!reminder) {
            return res.status(404).json({success: false, message: 'Reminder doesn\'t found.'})
        }

        res.status(200).json({success: true, message: 'Reminder was updated'})
    } catch (error: unknown) {
        const err = error as HttpError
        if(!err.statusCode) {
            err.statusCode = 500
            err.success = false
        }
        next(err)
    }
}

export const deleteReminder = async (req: Request<{reminderId: string}, {}, {}>, res: Response<DeleteReminderSuccessResponse | DeleteReminderErrorResponse>, next: NextFunction) => {
    const userId = '123'
    const reminderId  = req.params?.reminderId

    if(!reminderId) {
        return res.status(400).json({success: false, message: 'Reminder ID required.'})
    }

    try {
        const reminder = await Reminder.findOneAndDelete({_id: reminderId, creator: userId})

        if (!reminder) {
            return res.status(404).json({success: false, message: 'Reminder doesn\'t found.'})
        }

        res.status(200).json({success: true, message: 'Reminder was deleted'})
    } catch (error: unknown) {
        const err = error as HttpError
        if(!err.statusCode) {
            err.statusCode = 500
            err.success = false
        }
        next(err)
    }
}
import express from 'express';
import { body } from 'express-validator';
import {
    getReminders,
    getReminder,
    createReminder,
    editReminder,
    deleteReminder
} from '../controllers/reminders.controllers';
import {isAuth} from "../middleware/isAuth";

const router = express.Router()

router.post('/', isAuth, [
    body('title')
        .trim()
        .isString()
        .isLength({ min: 3 })
        .withMessage('Title should be at least 3 characters long'),
    body('text')
        .isString()
        .isLength({ min: 3 })
        .withMessage('Text should be at least 3 characters long')
], createReminder)

router.get('/', isAuth, getReminders)

router.get('/:reminderId', isAuth, getReminder)

router.put('/:reminderId', isAuth, [
        body('title')
            .trim()
            .isString()
            .isLength({ min: 3 })
            .withMessage('Title should be at least 3 characters long'),
        body('text')
            .isString()
            .isLength({ min: 3 })
            .withMessage('Text should be at least 3 characters long')
    ], editReminder)

router.delete('/:reminderId', isAuth, deleteReminder)

export default router;
import express from 'express';
import {body} from 'express-validator';
import {
    getReminders,
    getReminder,
    createReminder,
    editReminder,
    deleteReminder
} from '../controllers/reminders.controllers';

const router = express.Router()

router.post('/', [
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

router.get('/', getReminders)

router.get('/:id', getReminder)

router.put('/:id', [
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

router.delete('/:id', deleteReminder)

export default router;
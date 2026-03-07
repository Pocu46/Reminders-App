import express from 'express';
import {body, param} from 'express-validator';
import {
    getReminders,
    getReminder,
    createReminder,
    editReminder,
    deleteReminder
} from '../controllers/reminders.controllers';

const router = express.Router()

router.post('/', [
    // param('userId')
    //     .isString(),
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

// router.get('/:reminderId', getReminder)

// router.put('/:reminderId', [
//         body('title')
//             .trim()
//             .isString()
//             .isLength({ min: 3 })
//             .withMessage('Title should be at least 3 characters long'),
//         body('text')
//             .isString()
//             .isLength({ min: 3 })
//             .withMessage('Text should be at least 3 characters long')
//     ], editReminder)

router.delete('/:reminderId', deleteReminder)

export default router;
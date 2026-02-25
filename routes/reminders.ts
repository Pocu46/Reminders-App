import express, { Application, Request, Response } from 'express';
import {
    getReminders,
    getReminder,
    createReminder,
    editReminder,
    deleteReminder
} from '../controllers/reminders.controllers';

const router = express.Router()

router.post('/', createReminder)
router.get('/', getReminders)
router.get('/:id', getReminder)
router.put('/:id', editReminder)
router.delete('/:id', deleteReminder)

export default router;
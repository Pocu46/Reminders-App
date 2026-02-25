export const createReminder = (req: Request, res: Response) => {
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
    console.log('Edit Reminder')
}

export const deleteReminder = (req: Request, res: Response) => {
    console.log('Delete  Reminder')
}
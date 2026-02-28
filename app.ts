import express, { Application, Request, Response, NextFunction  } from 'express';
import dotenv from 'dotenv';
import remindersRoutes from './routes/reminders';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req: Request, res: Response, next: NextFunction) =>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

app.use('/reminders', remindersRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
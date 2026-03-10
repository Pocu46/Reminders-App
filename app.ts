import express, { Application, Request, Response, NextFunction  } from 'express';
import dotenv from 'dotenv';
import remindersRoutes from './routes/reminders';
import {connectToDB} from "./utils/dbConnect";

dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 5000
const API_PREFIX = process.env.API_PREFIX || '/api/v1'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req: Request, res: Response, next: NextFunction) =>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

app.use(`${API_PREFIX}/reminders`, remindersRoutes)

const startServer = async () => {
    try {
        await connectToDB();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}${API_PREFIX}`)
        });
    } catch (error) {
        console.error('Failed to start server: ', error)
        process.exit(1)
    }
}

startServer()
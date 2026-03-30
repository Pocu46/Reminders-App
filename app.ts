import express, { Application, Request, Response, NextFunction  } from 'express';
import dotenv from 'dotenv';
import remindersRoutes from './routes/reminders';
import userRoutes from './routes/users';
import path from 'path';
import {connectToDB} from "./utils/dbConnect";
import {HttpError} from "./utils/types";

dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 5000
const API_PREFIX = process.env.API_PREFIX || '/api/v1'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(`${API_PREFIX}/images`, express.static(path.join(__dirname, 'images')))

app.use((req: Request, res: Response, next: NextFunction) =>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next()
})

app.use(`${API_PREFIX}/user`, userRoutes)
app.use(`${API_PREFIX}/reminders`, remindersRoutes)

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) =>{
    console.error(error)
    const status = error.statusCode || 500
    const message = error.message
    res.status(status).send({success: false, message})
})

const startServer = async () => {
    try {
        await connectToDB();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}${API_PREFIX}`)
        });
    } catch (error: unknown) {
        console.error('Failed to start server: ', error)
        process.exit(1)
    }
}

startServer()
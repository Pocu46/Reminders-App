import express, { Application, Request, Response, NextFunction  } from 'express';
import dotenv from 'dotenv';
import remindersRoutes from './routes/reminders';
import userRoutes from './routes/users';
import path from 'path';
import multer from 'multer';
import {connectToDB} from "./utils/dbConnect";

dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 5000
const API_PREFIX = process.env.API_PREFIX || '/api/v1'

const fileStorage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {
        callback(null, 'images')
    },
    filename: (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
        callback(null, `${new Date().toISOString()}-${file.originalname.replace(/:/g, '-')}`)
    }
})

const fileFilter = (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
    if(file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
        callback(null, true)
    } else {
        callback(new Error('Invalid file type. Only PNG, JPEG and JPG are allowed.'))
    }
}

// const upload = multer({
//     storage: fileStorage,
//     fileFilter,
//     limits: { fileSize: 1024 * 1024 * 5 }
// })

app.use(express.json())
app.use(multer({storage: fileStorage, fileFilter}).single('image'))
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

app.use((error: Error & {statusCode?: number}, req: Request, res: Response, next: NextFunction) =>{
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
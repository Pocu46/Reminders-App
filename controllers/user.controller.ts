import {Request, Response, NextFunction} from "express";
import {validationResult} from "express-validator";
import User from "../models/user.model";
import {hashPassword} from "../utils/helpers";
import {
    CreateReminderErrorResponse,
    CreateReminderSuccessResponse,
    CreateUser, GetUserDataSuccessResponse, IUser, TransformedUser, UserFromDB, HttpError
} from "../utils/types";
import Reminder from "../models/reminder.model";
import {deleteImage} from "../utils/multer";

export const getUserData = async (req: Request<{userId: string}>, res: Response<GetUserDataSuccessResponse | CreateReminderErrorResponse>, next: NextFunction) => {
    const userId = req.params.userId

    try {
        const user: IUser | null = await User.findById(userId)
        if (!user) {
            return res.status(404).json({success: false, message: 'User doesn\'t exists!'})
        }

        const transformedUser: TransformedUser = {
            id: user._id.toString(),
            email: user.email,
            image: {
                imageName: user.image.imageName,
                imageLink: user.image.imageLink
            },
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }

        res.status(200).json({success: true, message: 'User Data fetched.', user: transformedUser})
    } catch (error: unknown) {
        const err = error as HttpError
        if(!err.statusCode) {
            err.statusCode = 500
            err.success = false
        }
        next(err)
    }
}

export const userUpdate = async(req: Request<{userId: string}, {}, CreateUser>, res: Response<CreateReminderSuccessResponse | CreateReminderErrorResponse>, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: 'Validation failed, entered data is incorrect.',
            errors: errors.array()
        })
    }

    const userId = req.params.userId
    const { email, password, confirmPassword } = req.body

    if(password !== confirmPassword) {
        return res.status(401).json({success: false, message: 'Passwords don\'t match!'})
    }

    try {
        const hashedPassword: string = await hashPassword(password, 12)
        const editedUser = {
            email,
            password: hashedPassword,
            updatedAt: new Date()
        }

        const user: IUser | null = await User.findById(userId)
        if (!user) {
            return res.status(404).json({success: false, message: 'User doesn\'t exists!'})
        }

        const updatedUser: UserFromDB | null = await User.findOneAndUpdate(
            { _id: user._id, createdAt: user.createdAt },
            { $set: editedUser },
            { returnDocument: 'after', runValidators: true }
        )

        if(!updatedUser) {
            return res.status(404).json({success: false, message: 'User doesn\'t found for update.'})
        }

        res.status(200).json({success: true, message: 'User was updated'})
    } catch (error: unknown) {
        const err = error as HttpError
        if(!err.statusCode) {
            err.statusCode = 500
            err.success = false
        }
        next(err)
    }
}

export const userImageUpdate = async(req: Request<{userId: string}>, res: Response, next: NextFunction) => {
    if(!req.file) {
        return res.status(422).json({success: false, message: 'No image found.'})
    }

    const imageName = req.file.filename
    const imageLink: string = req.file.path

    const userId = req.params.userId

    try {
        const editedUser = {
            image: {
                imageName,
                imageLink
            }
        }

        const user: IUser | null = await User.findById(userId)
        if (!user) {
            return res.status(404).json({success: false, message: 'User doesn\'t exists!'})
        }

        await deleteImage(user.image.imageName)

        const updatedUser: UserFromDB | null = await User.findOneAndUpdate(
            { _id: user._id, createdAt: user.createdAt },
            { $set: editedUser },
            { returnDocument: 'after', runValidators: true }
        )

        if(!updatedUser) {
            return res.status(404).json({success: false, message: 'User doesn\'t found for update.'})
        }

        res.status(200).json({success: true, message: 'User avatar was updated.'})
    } catch (error: unknown) {
        const err = error as HttpError
        if(!err.statusCode) {
            err.statusCode = 500
            err.success = false
        }
        next(err)
    }
}

export const userDelete = async(req: Request<{userId: string}, {}, {}>, res: Response<CreateReminderSuccessResponse | CreateReminderErrorResponse>, next: NextFunction) => {
    const userId = req.params.userId

    try {
        await Reminder.deleteMany({creator: userId})

        const user: IUser | null = await User.findById(userId)
        if (!user) {
            return res.status(404).json({success: false, message: 'User doesn\'t exists!'})
        }

        await deleteImage(user.image.imageName)

        await User.findByIdAndDelete(userId)

        res.status(200).json({success: true, message: 'User was deleted.'})
    } catch (error: unknown) {
        const err = error as HttpError
        if(!err.statusCode) {
            err.statusCode = 500
            err.success = false
        }
        next(err)
    }
}
import {Request, Response, NextFunction} from "express";
import {validationResult} from "express-validator";
import User from "../models/user.model";
import {comparePasswords, hashPassword} from "../utils/helpers";
import {
    CreateReminderErrorResponse,
    CreateReminderSuccessResponse,
    CreateUser, GetUserDataSuccessResponse, IUser, TransformedUser, UserFromDB,
    UserLogin
} from "../utils/types";
import Reminder from "../models/reminder.model";

export const userRegistration = async(req: Request<{}, {}, CreateUser>, res: Response<CreateReminderSuccessResponse | CreateReminderErrorResponse>, next: NextFunction) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(422).json({success: false, message: 'Validation failed, entered data is incorrect.', errors: errors.array()})
    }

    const { email, password, confirmPassword } = req.body

    if(password !== confirmPassword) {
        return res.status(400).json({success: false, message: 'Password and Confirm Password fields should match.'})
    }

    try {
        const hashedPassword = await hashPassword(password, 12)

        const user = new User({
            email,
            password: hashedPassword
        })

        const isUserExist = await User.findOne({email})

        if (isUserExist) {
            return res.status(409).json({success: false, message: 'Email is already exists!'})
        }

        await user.save()

        res.status(201).json({success: true, message: 'New User created'})
    } catch (error: unknown) {
        const err = error as Error & {statusCode?: number}
        if(!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}

export const userLogin = async(req: Request<{}, {}, UserLogin>, res: Response<CreateReminderSuccessResponse | CreateReminderErrorResponse>, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: 'Validation failed, entered data is incorrect.',
            errors: errors.array()
        })
    }

    const {email, password} = req.body

    try {
        const user = await User.findOne({email})

        if (!user) {
            return res.status(404).json({success: false, message: 'User doesn\'t exists!'})
        }

        const isPasswordMatch: boolean = await comparePasswords(password, user.password)

        if (!isPasswordMatch) {
            return res.status(401).json({success: false, message: 'Passwords don\'t match!'})
        }

        res.status(200).json({success: true, message: 'The User is logged!'})
    } catch (error: unknown) {
        const err = error as Error & {statusCode?: number}
        if(!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}

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
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }

        res.status(200).json({success: true, message: 'User Data fetched.', user: transformedUser})
    } catch (error: unknown) {
        const err = error as Error & {statusCode?: number}
        if(!err.statusCode) {
            err.statusCode = 500
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
        const err = error as Error & {statusCode?: number}
        if(!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}

export const userImageUpdate = async(req: Request, res: Response, next: NextFunction) => {
    console.log("User Image Update")
}

export const userDelete = async(req: Request<{userId: string}, {}, {}>, res: Response<CreateReminderSuccessResponse | CreateReminderErrorResponse>, next: NextFunction) => {
    const userId = req.params.userId

    try {
        await Reminder.deleteMany({creator: userId})

        const user: IUser | null = await User.findByIdAndDelete(userId)
        if (!user) {
            return res.status(404).json({success: false, message: 'User doesn\'t exists!'})
        }

        res.status(200).json({success: true, message: 'User was deleted.'})
    } catch (error: unknown) {
        const err = error as Error & {statusCode?: number}
        if(!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}
import {Request, Response, NextFunction} from "express";
import {validationResult} from "express-validator";
import User from "../models/user.model";
import {comparePasswords, hashPassword} from "../utils/helpers";
import {CreateReminderErrorResponse, CreateReminderSuccessResponse, CreateUser, UserLogin} from "../utils/types";

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

export const getUserData = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({success: true, message: 'User Data fetched.'})
}

export const userUpdate = async(req: Request, res: Response, next: NextFunction) => {
    console.log("User Update")
}

export const userImageUpdate = async(req: Request, res: Response, next: NextFunction) => {
    console.log("User Image Update")
}

export const userDelete = async(req: Request, res: Response, next: NextFunction) => {
    console.log("User Delete")
}
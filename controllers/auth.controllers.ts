import {Request, Response, NextFunction} from "express";
import {validationResult} from "express-validator";
import User from "../models/user.model";
import {CreateReminderErrorResponse, CreateReminderSuccessResponse, CreateUser, HttpError} from "../utils/types";
import {comparePasswords, hashPassword} from "../utils/helpers";
import path from "path";
import {signToken} from "../utils/signToken";
import {SECRET} from "../utils/helpers";

export const registration = async (req: Request<{}, {}, CreateUser>, res: Response<CreateReminderSuccessResponse | CreateReminderErrorResponse>, next: NextFunction) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(422).json({success: false, message: 'Validation failed, entered data is incorrect.', errors: errors.array()})
    }

    const { email, password, confirmPassword } = req.body

    if(password !== confirmPassword) {
        return res.status(400).json({success: false, message: 'Password and Confirm Password fields should match.'})
    }

    const avatarPath: string = path.join(__dirname, '../images/default-avatar.png')
    const avatarName: string = 'default-avatar.png'

    try {
        const hashedPassword = await hashPassword(password, 12)

        const user = new User({
            email,
            password: hashedPassword,
            image: {
                imageName: avatarName,
                imageLink: avatarPath
            }
        })

        const isUserExist = await User.findOne({email})

        if (isUserExist) {
            return res.status(409).json({success: false, message: 'Email is already exists!'})
        }

        await user.save()

        res.status(201).json({success: true, message: 'New User created!'})
    } catch (error: unknown) {
        const err = error as HttpError
        if(!err.statusCode) {
            err.statusCode = 500
            err.success = false
        }
        next(err)
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
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

        const token = await signToken(
            { email, userId: user._id.toString() },
            SECRET,
            { expiresIn: '1h' }
        )

        if (!token) {
            return res.status(401).json({success: false, message: 'Not authenticated!'})
        }

        res.status(200).json({success: true, message: 'The User is logged!', token, userId: user._id.toString()})
    } catch (error: unknown) {
        const err = error as HttpError
        if(!err.statusCode) {
            err.statusCode = 500
            err.success = false
        }
        next(err)
    }
}
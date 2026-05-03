import jwt, { JwtPayload } from "jsonwebtoken";
import { Response, NextFunction } from "express";
import {AuthenticatedRequest, HttpError} from "../utils/types";
import { SECRET } from "../utils/helpers";

export const isAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.get('Authorization')
    if (!authHeader) {
        const err = new Error('Not authenticated!') as HttpError
        err.statusCode = 401
        err.success = false
        throw err
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authenticated!' })
    }

    let decodedToken: JwtPayload | string | null = null

    try {
        decodedToken = jwt.verify(token, SECRET)
    } catch (error: unknown) {
        const err = error as HttpError
        if (!err.statusCode) {
            err.statusCode = 500
            err.success = false
        }
        return next(err)
    }

    if (!decodedToken || typeof decodedToken === 'string' || !('userId' in decodedToken)) {
        const err = new Error('Not authenticated!') as HttpError
        err.statusCode = 401
        err.success = false
        throw err
    }

    req.userId = decodedToken.userId as string
    next()
}
import express from 'express';
import { body } from 'express-validator';
import {
    getUserData,
    userDelete,
    userImageUpdate,
    userUpdate
} from "../controllers/user.controller";
import { upload } from '../utils/multer';
import {isAuth} from "../middleware/isAuth";

const router = express.Router()

router.get('/:userId', isAuth, getUserData)
router.put('/:userId', isAuth, [
    body('email')
        .trim()
        .toLowerCase()
        .notEmpty()
        .withMessage('Email is required.')
        .isEmail()
        .withMessage('Email format isn\'t correct.'),
    body('password')
        .trim()
        .isString()
        .withMessage('Password must be a string.')
        .isLength({ min: 8 })
        .withMessage('Password should be at least 8 characters long.')
        .matches(/[a-z]/)
        .withMessage('Password should contain lowercase letters.')
        .matches(/[A-Z]/)
        .withMessage('Password should contain uppercase letters.')
        .matches(/\d/)
        .withMessage('Password should contain digits.')
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage('Password should contain only letters and digits.'),
    body('confirmPassword')
        .trim()
        .isString()
        .withMessage('Confirm Password must be a string.')
        .isLength({ min: 8 })
        .withMessage('Confirm Password should be at least 8 characters long.')
        .matches(/[a-z]/)
        .withMessage('Confirm Password should contain lowercase letters.')
        .matches(/[A-Z]/)
        .withMessage('Confirm Password should contain uppercase letters.')
        .matches(/\d/)
        .withMessage('Confirm Password should contain digits.')
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage('Confirm Password should contain only letters and digits.')
], userUpdate)
router.put('/:userId/avatar', isAuth, upload.single('image'), userImageUpdate)
router.delete('/:userId', isAuth, userDelete)

export default router;
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

const uploadDir: string = path.join(__dirname, '../images')

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const fileStorage: multer.StorageEngine = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, uploadDir)
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        const safeDate: string = new Date().toISOString().replace(/[:.]/g, '-')
        cb(null, `${safeDate}-${file.originalname}`)
    }
})

const fileFilter: multer.Options['fileFilter'] = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/jpg'
    ) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PNG, JPEG, and JPG are allowed.'))
    }
}

export const upload: multer.Multer = multer({
    storage: fileStorage,
    fileFilter
})

export const deleteImage = async (fileName: string): Promise<void> => {
    try {
        if (!fileName) return
        if (fileName === 'default-avatar.png') return

        const fullPath = path.join(uploadDir, fileName)

        await fs.promises.access(fullPath)
        await fs.promises.unlink(fullPath)
    } catch (error) {
        console.error('Error in deleteImage:', error)
    }
}
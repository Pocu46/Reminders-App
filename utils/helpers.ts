const bcrypt = require('bcrypt')
// import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string, saltRounds = 10) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds)
        const hash = await bcrypt.hash(password, salt)

        return hash;
    } catch (error: unknown) {
        return new Error(`Hash password error: ${(error as Error).message}`)
    }
}

export const comparePasswords = async (password: string, hashedPassword: string) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        console.error('Ошибка при сравнении паролей:', error);
        return false;
    }
}
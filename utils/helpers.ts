const bcrypt = require('bcrypt')

export const hashPassword = async (password: string, saltRounds = 10) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds)
        const hash = await bcrypt.hash(password, salt)

        return hash;
    } catch (error: unknown) {
        return new Error(`Hash password error: ${(error as Error).message}`)
    }
}
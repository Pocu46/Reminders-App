import test, { APIRequestContext, expect } from '@playwright/test';

type UserRegistrationResponse = {
    success: boolean;
    message: string;
}

type UserLoginResponse = {
    success: boolean;
    message: string;
    userId: string;
    token: string;
}

type UserData = {
    heading: string;
    email: string;
    password: string | number;
    confirmPassword?: string | number;
    statusCode: number;
    successStatus: boolean;
    messageText: string;
}

type GetUserDataResponse = {
    success: boolean;
    message: string;
    user: {
        id: string;
        email: string;
        image: {
            imageName: string;
            imageLink: string;
        }
    createdAt: string;
    updatedAt: string;
    };
};

export class UsersApiPage {
    readonly request: APIRequestContext
    readonly apiPrefix: string = 'api/v1/'
    readonly testEmail: string = `test_${Date.now()}_${crypto.randomUUID()}@example.com`
    readonly testPassword: string = 'Text1909892'
    readonly userData: UserData[]
    readonly userLoginData: UserData[]

    constructor(request: APIRequestContext) {
        this.request = request
        this.userData = [
            {
                heading: 'valid data',
                email: this.testEmail,
                password: this.testPassword,
                confirmPassword: this.testPassword,
                statusCode: 201,
                successStatus: true,
                messageText: 'New User created!'
            },
            {
                heading: 'an already registered Email',
                email: this.testEmail,
                password: this.testPassword,
                confirmPassword: this.testPassword,
                statusCode: 409,
                successStatus: false,
                messageText: 'Email is already exists!'
            },
            {
                heading: 'empty Email field',
                email: '',
                password: this.testPassword,
                confirmPassword: this.testPassword,
                statusCode: 422,
                successStatus: false,
                messageText: 'Validation failed, entered data is incorrect.'
            },
            {
                heading: 'an Email without @ symbol',
                email: `test_${test.info().project.name}_${Date.now()}example.com`,
                password: this.testPassword,
                confirmPassword: this.testPassword,
                statusCode: 422,
                successStatus: false,
                messageText: 'Validation failed, entered data is incorrect.'
            },
            {
                heading: 'an Email without domain',
                email: `test_${test.info().project.name}_${Date.now()}@example`,
                password: this.testPassword,
                confirmPassword: this.testPassword,
                statusCode: 422,
                successStatus: false,
                messageText: 'Validation failed, entered data is incorrect.'
            },
            {
                heading: 'an empty Password field',
                email: this.testEmail,
                password: '',
                confirmPassword: this.testPassword,
                statusCode: 422,
                successStatus: false,
                messageText: 'Validation failed, entered data is incorrect.'
            },
            {
                heading: 'a Password shorter than 8 characters',
                email: this.testEmail,
                password: 'Test123',
                confirmPassword: this.testPassword,
                statusCode: 422,
                successStatus: false,
                messageText: 'Validation failed, entered data is incorrect.'
            },
            {
                heading: 'a Password which isn\'t a string',
                email: this.testEmail,
                password: 12345678,
                confirmPassword: this.testPassword,
                statusCode: 422,
                successStatus: false,
                messageText: 'Validation failed, entered data is incorrect.'
            },
            {
                heading: 'a Password without lowercase letters',
                email: this.testEmail,
                password: 'TEST1234',
                confirmPassword: this.testPassword,
                statusCode: 422,
                successStatus: false,
                messageText: 'Validation failed, entered data is incorrect.'
            },
            {
                heading: 'a Password without uppercase letters',
                email: this.testEmail,
                password: 'test1234',
                confirmPassword: this.testPassword,
                statusCode: 422,
                successStatus: false,
                messageText: 'Validation failed, entered data is incorrect.'
            },
            {
                heading: 'a Password without digits',
                email: this.testEmail,
                password: 'testWithOutDigits',
                confirmPassword: this.testPassword,
                statusCode: 422,
                successStatus: false,
                messageText: 'Validation failed, entered data is incorrect.'
            },
            {
                heading: 'a Password with special characters in it',
                email: this.testEmail,
                password: 'test@$%1234',
                confirmPassword: this.testPassword,
                statusCode: 422,
                successStatus: false,
                messageText: 'Validation failed, entered data is incorrect.'
            },
            {
                heading: 'an empty Confirm Password field',
                email: this.testEmail,
                password: this.testPassword,
                confirmPassword: '',
                statusCode: 422,
                successStatus: false,
                messageText: 'Validation failed, entered data is incorrect.'
            },
            {
                heading: 'a Confirm Password shorter than 8 characters',
                email: this.testEmail,
                password: this.testPassword,
                confirmPassword: 'Test123',
                statusCode: 422,
                successStatus: false,
                messageText: 'Validation failed, entered data is incorrect.'
            },
            {
                heading: 'a Confirm Password which isn\'t a string',
                email: this.testEmail,
                password: this.testPassword,
                confirmPassword: 12345678,
                statusCode: 422,
                successStatus: false,
                messageText: 'Validation failed, entered data is incorrect.'
            },
            {
                heading: 'a Confirm Password without lowercase letters',
                email: this.testEmail,
                password: this.testPassword,
                confirmPassword: 'TEST1234',
                statusCode: 422,
                successStatus: false,
                messageText: 'Validation failed, entered data is incorrect.'
            },
            {
                heading: 'a Confirm Password without uppercase letters',
                email: this.testEmail,
                password: this.testPassword,
                confirmPassword: 'test1234',
                statusCode: 422,
                successStatus: false,
                messageText: 'Validation failed, entered data is incorrect.'
            },
            {
                heading: 'a Confirm Password without digits',
                email: this.testEmail,
                password: this.testPassword,
                confirmPassword: 'testWithOutDigits',
                statusCode: 422,
                successStatus: false,
                messageText: 'Validation failed, entered data is incorrect.'
            },
            {
                heading: 'a Confirm Password with special characters in it',
                email: this.testEmail,
                password: this.testPassword,
                confirmPassword: 'test@$%1234',
                statusCode: 422,
                successStatus: false,
                messageText: 'Validation failed, entered data is incorrect.'
            },
            {
                heading: 'a Password and Confirm Password fields that don\'t match',
                email: this.testEmail,
                password: this.testPassword,
                confirmPassword: 'Different1234',
                statusCode: 400,
                successStatus: false,
                messageText: 'Password and Confirm Password fields should match.'
            }
        ]
        this.userLoginData = [
            {
                heading: 'valid data',
                email: this.testEmail,
                password: this.testPassword,
                statusCode: 200,
                successStatus: true,
                messageText: 'The User is logged!'
            },
            {
                heading: 'empty Email field',
                email: '',
                password: this.testPassword,
                statusCode: 422,
                successStatus: false,
                messageText: 'Validation failed, entered data is incorrect.'
            },
            {
                heading: 'an Email without @ symbol',
                email: `test_${test.info().project.name}_${Date.now()}example.com`,
                password: this.testPassword,
                statusCode: 422,
                successStatus: false,
                messageText: 'Validation failed, entered data is incorrect.'
            },
            {
                heading: 'Email that isn\'t registered',
                email: 'nonexistent@example.com',
                password: this.testPassword,
                statusCode: 404,
                successStatus: false,
                messageText: 'User doesn\'t exists!'
            },
            {
                heading: 'an empty Password field',
                email: this.testEmail,
                password: '',
                statusCode: 422,
                successStatus: false,
                messageText: 'Validation failed, entered data is incorrect.'
            },
            {
                heading: 'not existing Password',
                email: this.testEmail,
                password: 'nonexistentPassword123',
                statusCode: 401,
                successStatus: false,
                messageText: 'Passwords don\'t match!'
            },
        ]
    }

    async userRegistration() {
        const [validCase, duplicateCase, ...negativeCases] = this.userData

        const runRegistrationStep = async (userData: UserData) => {
            const {heading, email, password, confirmPassword, statusCode, successStatus, messageText} = userData

            await test.step(`Verify User Registration with ${heading}`, async () => {
                const response = await this.request.post(`${this.apiPrefix}auth/registration`, {
                    data: {
                        email,
                        password,
                        confirmPassword
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                expect(response.status()).toBe(statusCode)

                const responseBody: UserRegistrationResponse = await response.json()

                expect(responseBody.success).toBe(successStatus)
                expect(responseBody.message).toBe(messageText)
            })
        }

        await runRegistrationStep(validCase)
        await runRegistrationStep(duplicateCase)

        await Promise.all(negativeCases.map(userData => runRegistrationStep(userData)))
    }

    async userCreate() {
        await this.request.post(`${this.apiPrefix}auth/registration`, {
            data: {
                email: this.testEmail,
                password: this.testPassword,
                confirmPassword: this.testPassword
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    async userLogin() {
        const [validCase, ...negativeCases] = this.userLoginData

        const runLoginStep = async (userData: UserData) => {
            const {heading, email, password, statusCode, successStatus, messageText} = userData

            await test.step(`Verify User Login with ${heading}`, async () => {
                const response = await this.request.post(`${this.apiPrefix}auth/login`, {
                    data: {
                        email,
                        password
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                expect(response.status()).toBe(statusCode)

                const responseBody: UserLoginResponse = await response.json()

                expect(responseBody.success).toBe(successStatus)
                expect(responseBody.message).toBe(messageText)

                if (successStatus) {
                    expect(responseBody).toHaveProperty('userId')
                    expect(responseBody).toHaveProperty('token')
                }
            })
        }

        await runLoginStep(validCase)
        await Promise.all(negativeCases.map(userData => runLoginStep(userData)))
    }

    async userAuth() {
        const response = await this.request.post(`${this.apiPrefix}auth/login`, {
            data: {
                email: this.testEmail,
                password: this.testPassword
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const {userId, token}: UserLoginResponse = await response.json()

        return {userId, token}
    }

    async getUserData(userId: string, token: string) {
        const response = await this.request.get(`${this.apiPrefix}user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        expect(response.status()).toBe(200)

        const responseBody: GetUserDataResponse = await response.json()

        expect(responseBody.success).toBe(true)
        expect(responseBody.message).toBe('User Data fetched.')
        expect(responseBody.user.email).toBe(this.testEmail)
        expect(responseBody.user).toHaveProperty('id')
        expect(responseBody.user.image.imageName).toMatch(/default-avatar\.png/);
        expect(responseBody.user.image).toHaveProperty('imageLink')
        expect(responseBody.user).toHaveProperty('createdAt')
        expect(responseBody.user).toHaveProperty('updatedAt')
    }

    async getUserDataInvalidUserId(token: string) {
        const invalidUserId = 'invalid-user-id'
        const response = await this.request.get(`${this.apiPrefix}user/${invalidUserId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        expect(response.status()).toBe(500) 
        const responseBody: GetUserDataResponse = await response.json()

        expect(responseBody).toHaveProperty('success')
        expect(responseBody.success).toBe(false)
    }

    async getUserDataInvalidToken(userId: string) {
        const invalidToken = 'invalid-token'
        const response = await this.request.get(`${this.apiPrefix}user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${invalidToken}`
            }
        })

        expect(response.status()).toBe(500) 
        const responseBody: GetUserDataResponse = await response.json()

        expect(responseBody).toHaveProperty('success')
        expect(responseBody.success).toBe(false)
    }

    async updateUserAvatarSuccess(userId: string, token: string, imagePath: string) {
        const response = await this.request.post(`${this.apiPrefix}user/${userId}/avatar`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: {
                image: imagePath
            }
        })

        expect(response.status()).toBe(200)

        const responseBody = await response.json()

        expect(responseBody.success).toBe(true)
        expect(responseBody.message).toBe('User avatar updated.')
    }

    async clearUser(userId: string, token: string) {
        const response = await this.request.delete(`${this.apiPrefix}user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        expect(response.status()).toBe(200)
    }

    async userDelete(userId: string, token: string) {
        const response = await this.request.delete(`${this.apiPrefix}user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        expect(response.status()).toBe(200)
        const responseBody = await response.json()

        expect(responseBody).toHaveProperty('success')
        expect(responseBody.success).toBe(true)
        expect(responseBody).toHaveProperty('message')
        expect(responseBody.message).toBe('User was deleted.')
    }

    async userDeleteInvalidUserId(token: string) {
        const invalidUserId = 'invalid-user-id'
        const response = await this.request.delete(`${this.apiPrefix}user/${invalidUserId}`, {
            headers: {  
                'Authorization': `Bearer ${token}`
            }
        })

        expect(response.status()).toBe(500)
        const responseBody = await response.json()

        expect(responseBody).toHaveProperty('success')
        expect(responseBody.success).toBe(false)
    }

    async userDeleteInvalidToken(userId: string) {
        const invalidToken = 'invalid-token'
        const response = await this.request.delete(`${this.apiPrefix}user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${invalidToken}`
            }
        })

        expect(response.status()).toBe(500)
        const responseBody = await response.json()

        expect(responseBody).toHaveProperty('success')
        expect(responseBody.success).toBe(false)
    }
}
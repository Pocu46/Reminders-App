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
    confirmPassword: string | number;
    statusCode: number;
    successStatus: boolean;
    messageText: string;
}

export class RemindersApiPage {
    readonly request: APIRequestContext
    readonly apiPrefix: string = 'api/v1/'
    readonly testEmail: string = `test_${test.info().project.name}_${Date.now()}@example.com`
    readonly testPassword: string = 'Text1909892'
    readonly userData: UserData[]

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
    }

    async userRegistration() {
        for (const userData of this.userData) {
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
        
                expect(responseBody).toHaveProperty('success');
                expect(responseBody.success).toBe(successStatus);
                expect(responseBody).toHaveProperty('message');
                expect(responseBody.message).toBe(messageText)
            })
        }
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
        const response = await this.request.post(`${this.apiPrefix}auth/login`, {
            data: {
                email: this.testEmail,
                password: this.testPassword
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }) 

        expect(response.status()).toBe(200)
    }

    async clearUser() {
        const response = await this.request.post(`${this.apiPrefix}auth/login`, {
            data: {
                email: this.testEmail,
                password: this.testPassword
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }) 

        const responseBody: UserLoginResponse = await response.json()
        const userId = responseBody.userId
        const token = responseBody.token

        await this.request.delete(`${this.apiPrefix}user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }
}
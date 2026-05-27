import test, { APIRequestContext, expect } from '@playwright/test';

type ReminderData = {
    heading: string,
    title: string,
    text: string,
    statusCode: number;
    successStatus: boolean;
    messageText: string;
}

type Reminder = {
    id: string;
    title: string;
    text: string;
    creator: string;
    createdAt: string;
    updatedAt: string;
}

type CreateReminderResponse = {
    success: boolean;
    message: string;
    reminderId?: string;
}

type GetReminderResponse = {
    success: boolean;
    message: string;
    totalReminders: number;
    reminders: Reminder[];
}

export class RemindersApiPage {
    readonly request: APIRequestContext
    readonly apiPrefix: string = 'api/v1/'
    readonly remindersData: ReminderData[]

    constructor(request: APIRequestContext) {
        this.request = request
        this.remindersData = [
            {
                heading: 'Verify create Reminder with valid data',
                title: 'Test Reminder',
                text: 'This is a test reminder.',
                statusCode: 201,
                successStatus: true,
                messageText: 'New Reminder created.'
            },
            {
                heading: 'Verify create Reminder with Title less than 3 characters',
                title: 'Te',               
                text: 'This is a test reminder.',
                statusCode: 422,
                successStatus: false,
                messageText: 'Validation failed, entered data is incorrect.'
            },
            {
                heading: 'Verify create Reminder with Text less than 3 characters',
                title: 'Test Reminder',
                text: 'Te',
                statusCode: 422,
                successStatus: false,
                messageText: 'Validation failed, entered data is incorrect.'
            }
        ]
    }

    async createReminder(token: string) {
        const [validReminderData, ...invalidReminderData] = this.remindersData

        const createReminderStep = async (reminderData: ReminderData) => {
            const { heading, title, text, statusCode, successStatus, messageText } = reminderData

            await test.step(heading, async () => {
                const response = await this.request.post(`${this.apiPrefix}reminders/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    data: {
                        title,
                        text
                    }
                })
                expect(response.status()).toBe(statusCode)

                const responseBody: CreateReminderResponse = await response.json()

                expect(responseBody.success).toBe(successStatus)
                expect(responseBody.message).toBe(messageText)
            })

            await createReminderStep(validReminderData)

            await Promise.all(invalidReminderData.map(reminderData => createReminderStep(reminderData)))
        }
    }

    async createReminderWithOutToken() {
        test.step('Verify create Reminder without token', async () => {
            const response = await this.request.post(`${this.apiPrefix}reminders/`, {
                data: {
                    title: 'Test Reminder',
                    text: 'This is a test reminder.'
                }
            })

            expect(response.status()).toBe(401)

            const responseBody: CreateReminderResponse = await response.json()

            expect(responseBody.success).toBe(false)
        })
    }

    async addNewReminder(token: string) {
        const title = `Test Reminder ${Date.now()}`
        const text = 'lorem ipsum dolor sit amet, consectetur adipiscing elit.'  

        const response = await this.request.post(`${this.apiPrefix}reminders/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: {
                title,
                text
            }
        })

        expect(response.status()).toBe(201)
    }

    async getReminders(token: string) {
        test.step('Verify get Reminders', async () => {
            const response = await this.request.get(`${this.apiPrefix}reminders/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            expect(response.status()).toBe(200)

            const responseBody: GetReminderResponse = await response.json()
            expect(responseBody.success).toBe(true)
            expect(responseBody.message).toBe('Fetched Reminders successfully.')
            expect(Array.isArray(responseBody.reminders)).toBe(true)
            expect(responseBody.totalReminders).toBeGreaterThanOrEqual(1)
        })
    }

    async getRemindersWithoutToken() {
        test.step('Verify get Reminders without token', async () => {
            const response = await this.request.get(`${this.apiPrefix}reminders/`)

            expect(response.status()).toBe(401)

            const responseBody: GetReminderResponse = await response.json()
            expect(responseBody.success).toBe(false)
        })
    }
}
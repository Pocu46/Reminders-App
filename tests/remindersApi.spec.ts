import { test, APIRequestContext } from '@playwright/test';
import { UsersApiPage } from './pages/usersApi.page';
import { RemindersApiPage } from './pages/remindersApi.page';

let api: UsersApiPage
let userId: string
let token: string
let remindersApi: RemindersApiPage

test.beforeEach(async ({ request }: { request: APIRequestContext }, testInfo) => {
    api = new UsersApiPage(request)
    remindersApi = new RemindersApiPage(api.request)

    await api.userCreate()
    const auth = await api.userAuth()
    userId = auth.userId
    token = auth.token

    if (testInfo.title !== 'Create Reminder tests') {
        await remindersApi.addNewReminder(token)
    }
})

test.afterEach(async ({ request }: { request: APIRequestContext }, testInfo) => {
    try {
        if (userId && token) {
            await api.clearUser(userId, token)
        }
    } catch (e) {
        console.error('Error during cleanup:', e)
    }
})

test.describe('Reminders API Tests', () => {
    test('Create Reminder tests', async () => {
        await remindersApi.createReminder(token)
        await remindersApi.createReminderWithOutToken()
    })

    test('Get Reminders tests', async () => {
        await remindersApi.getReminders(token)
        await remindersApi.getRemindersWithoutToken()
    })
})
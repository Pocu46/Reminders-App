import { test, APIRequestContext } from '@playwright/test';
import { UsersApiPage } from './pages/usersApi.page';
import { RemindersApiPage } from './pages/remindersApi.page';

let api: UsersApiPage
let userId: string
let token: string
let remindersApi: RemindersApiPage
let reminderId: string
let id: string
let otherUserId: string
let otherUserToken: string
let otherApi: UsersApiPage

test.beforeEach(async ({ request }: { request: APIRequestContext }, testInfo) => {
    api = new UsersApiPage(request)
    remindersApi = new RemindersApiPage(api.request)

    await api.userCreate()
    const auth = await api.userAuth()
    userId = auth.userId
    token = auth.token

    if (testInfo.title !== 'Create Reminder tests') {
        const tempReminderId = await remindersApi.addNewReminder(token)
        if (tempReminderId) {
            reminderId = tempReminderId
        } else {
            throw new Error('Failed to create reminder for testing')
        }
    }
    if (testInfo.title === 'Get Reminder by ID tests' || testInfo.title === 'Edit Reminder tests' || testInfo.title === 'Delete Reminder tests') {
        otherApi = new UsersApiPage(request)
        await otherApi.userCreate()
        const otherAuth = await otherApi.userAuth()
        otherUserId = otherAuth.userId
        otherUserToken = otherAuth.token
        const tempId = await remindersApi.addNewReminder(otherUserToken)
        if (tempId) {
            id = tempId
        } else {
            throw new Error('Failed to create reminder for testing')
        }
    }
})

test.afterEach(async ({ request }: { request: APIRequestContext }, testInfo) => {
    try {
        if (userId && token) {
            await api.clearUser(userId, token)
        }
        if (testInfo.title === 'Get Reminder by ID tests') {
            await otherApi.clearUser(otherUserId, otherUserToken)
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

    test('Get Reminder by ID tests', async () => {
        await remindersApi.getReminderById(token, reminderId)
        await remindersApi.getReminderByIdWithWrongId(token)
        await remindersApi.getReminderByIdWithoutToken(reminderId)
        await remindersApi.getReminderByIdWithWrongReminderId(token, id)
    })

    test('Edit Reminder tests', async () => {
        await remindersApi.editReminder(token, reminderId)
        await remindersApi.editReminderWithOutToken(reminderId)
        await remindersApi.editReminderWithAnotherUserToken(otherUserToken, reminderId)
    })

    test('Delete Reminder tests', async () => {
        await remindersApi.deleteReminder(token, reminderId)
        await remindersApi.deleteReminderWithOutToken(reminderId)
        await remindersApi.deleteReminderWithAnotherUserToken(otherUserToken, reminderId)
    })
})
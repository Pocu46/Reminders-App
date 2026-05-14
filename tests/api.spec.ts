import { test, APIRequestContext } from '@playwright/test';
import { RemindersApiPage } from './pages/remindersApi.page';

test.describe('API Tests', () => {
    test('User Registration tests', async ({ request }: { request: APIRequestContext }) => {
        const api = new RemindersApiPage(request)

        await api.userRegistration()
        const {userId, token} = await api.userAuth()
        await api.clearUser(userId, token)
    })

    test('User Login tests', async ({ request }: { request: APIRequestContext }) => {
        const api = new RemindersApiPage(request)

        await api.userCreate()
        await api.userLogin()
        const {userId, token} = await api.userAuth()
        await api.clearUser(userId, token)
    })
    
    test('Get User data tests', async ({ request }: { request: APIRequestContext }) => {
        const api = new RemindersApiPage(request)

        await test.step('Get User data with valid credentials', async () => {
            await api.userCreate()
            const {userId, token} = await api.userAuth()
            await api.getUserData(userId, token)
            await api.clearUser(userId, token)
        })

        await test.step('Get User data with invalid User ID', async () => {
            await api.userCreate()
            const {token} = await api.userAuth()
            const invalidUserId = 'invalid-user-id'
            await api.getUserDataInvalidUserId(token)
            await api.clearUser(invalidUserId, token)
        })

        await test.step('Get User data with invalid token', async () => {
            await api.userCreate()
            const {userId} = await api.userAuth()
            await api.getUserDataInvalidToken(userId)
            await api.clearUser(userId, 'invalid-token')
        })
    })
})
import { test, APIRequestContext } from '@playwright/test';
import { UsersApiPage } from './pages/usersApi.page';

let api: UsersApiPage
let userId: string
let token: string

test.beforeEach(async ({ request }: { request: APIRequestContext }, testInfo) => {
    api = new UsersApiPage(request)
    
    if (testInfo.title === 'User Registration tests') return

    await api.userCreate()
    const auth = await api.userAuth()
    userId = auth.userId
    token = auth.token
})

test.afterEach(async ({ request }: { request: APIRequestContext }) => {
    try {
        await api.clearUser(userId, token)
    } catch (e) {
        console.error('Error during cleanup:', e)
    }
})

test.describe('User API Tests', () => {
    test('User Registration tests', async ({ request }: { request: APIRequestContext }) => {
        await api.userRegistration()
    })

    test('User Login tests', async ({ request }: { request: APIRequestContext }) => {
        await api.userLogin()
    })

    test('Get User data tests', async ({ request }: { request: APIRequestContext }) => {
        await test.step('Get User data with valid credentials', async () => {
            await api.getUserData(userId, token)
        })

        await test.step('Get User data with invalid User ID', async () => {
            await api.getUserDataInvalidUserId(token)
        })

        await test.step('Get User data with invalid token', async () => {
            await api.getUserDataInvalidToken(userId)
        })
    })

    test('Update User avatar tests', async ({ request }: { request: APIRequestContext }) => {
        await test.step('Update User avatar with valid credentials', async () => {

        })
    })

    test('Delete User tests', async ({ request }: { request: APIRequestContext }) => {
        await test.step('Delete User with valid credentials', async () => {
            await api.userDelete(userId, token)
        })

        await test.step('Delete User with invalid User ID', async () => {
            await api.userDeleteInvalidUserId(token)
        })

        await test.step('Delete User with invalid token', async () => {
            await api.userDeleteInvalidToken(userId)
        })
    })
})
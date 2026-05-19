import { test, APIRequestContext } from '@playwright/test';
import { UsersApiPage } from './pages/usersApi.page';

let api: UsersApiPage

test.beforeEach(async ({ request }: { request: APIRequestContext }) => {
    api = new UsersApiPage(request)
})

test.afterEach(async ({ request }: { request: APIRequestContext }) => {
    try {
        const {userId, token} = await api.userAuth()
        await api.clearUser(userId, token)
    } catch (e) {
        console.error('Error during cleanup:', e)
    }
})

test.describe('User API Tests', () => {
    test.beforeEach(async ({}, testInfo) => {
        if (testInfo.title === 'User Registration tests') return

        await api.userCreate()
    })
    test('User Registration tests', async ({ request }: { request: APIRequestContext }) => {
        await api.userRegistration()
    })

    test('User Login tests', async ({ request }: { request: APIRequestContext }) => {
        await api.userLogin()
    })

    test('Get User data tests', async ({ request }: { request: APIRequestContext }) => {
        await test.step('Get User data with valid credentials', async () => {
            const {userId, token} = await api.userAuth()
            await api.getUserData(userId, token)
        })

        await test.step('Get User data with invalid User ID', async () => {
            const {token} = await api.userAuth()
            await api.getUserDataInvalidUserId(token)
        })

        await test.step('Get User data with invalid token', async () => {
            const {userId} = await api.userAuth()
            await api.getUserDataInvalidToken(userId)
        })
    })

    test('Update User avatar tests', async ({ request }: { request: APIRequestContext }) => {
        await test.step('Update User avatar with valid credentials', async () => {

        })
    })

    test('Delete User tests', async ({ request }: { request: APIRequestContext }) => {
        await test.step('Delete User with valid credentials', async () => {
            const {userId, token} = await api.userAuth()
            await api.userDelete(userId, token)
        })

        await test.step('Delete User with invalid User ID', async () => {
            const {token} = await api.userAuth()
            await api.userDeleteInvalidUserId(token)
        })

        await test.step('Delete User with invalid token', async () => {
            const {userId} = await api.userAuth()
            await api.userDeleteInvalidToken(userId)
        })
    })
})
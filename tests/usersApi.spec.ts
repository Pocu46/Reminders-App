import { test, APIRequestContext } from '@playwright/test';
import { UsersApiPage } from './pages/usersApi.page';

let api: UsersApiPage

test.beforeEach(async ({ request }: { request: APIRequestContext }) => {
    api = new UsersApiPage(request)
})

test.afterEach(async ({ request }: { request: APIRequestContext }) => {
    const {userId, token} = await api.userAuth()
    await api.clearUser(userId, token)
})

test.describe('User API Tests', () => {
    test('User Registration tests', async ({ request }: { request: APIRequestContext }) => {
        await api.userRegistration()
    })

    test('User Login tests', async ({ request }: { request: APIRequestContext }) => {
        await api.userCreate()
        await api.userLogin()
        const {userId, token} = await api.userAuth()
        await api.clearUser(userId, token)
    })

    test('Get User data tests', async ({ request }: { request: APIRequestContext }) => {
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

    test('Update User avatar tests', async ({ request }: { request: APIRequestContext }) => {
        await test.step('Update User avatar with valid credentials', async () => {

        })
    })

    test('Delete User tests', async ({ request }: { request: APIRequestContext }) => {
        await test.step('Delete User with valid credentials', async () => {
            await api.userCreate()
            const {userId, token} = await api.userAuth()
            await api.userDelete(userId, token)
        })

        await test.step('Delete User with invalid User ID', async () => {
            await api.userCreate()
            const {token} = await api.userAuth()
            await api.userDeleteInvalidUserId(token)
        })

        await test.step('Delete User with invalid token', async () => {
            await api.userCreate()
            const {userId} = await api.userAuth()
            await api.userDeleteInvalidToken(userId)
        })
    })
})
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

test.afterEach(async ({ request }: { request: APIRequestContext }, testInfo) => {
    try {
        if (testInfo.title === 'User Registration tests') {
            const auth = await api.userAuth()
            await api.clearUser(auth.userId, auth.token)
        } else if (userId && token) {
            await api.clearUser(userId, token)
        }
    } catch (e) {
        console.error('Error during cleanup:', e)
    }
})

test.describe('User API Tests', () => {
    test('User Registration tests', async () => {
        await api.userRegistration()
    })

    test('User Login tests', async () => {
        await api.userLogin()
    })

    test('Get User data tests', async () => {
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

    test('Update User data tests', async () => {
        await test.step('Update User data with valid credentials', async () => {
            await api.userUpdate(userId, token)
        })

        await api.userUpdateInvalidCases(userId, token)
    })

    test('Update User avatar tests', async () => {
        await test.step('Update User avatar with valid credentials', async () => {
            await api.updateUserAvatarSuccess(userId, token)
        })

        await test.step('Update User avatar with invalid User ID', async () => {
            await api.updateUserAvatarInvalidUserId(token)
        })

        await test.step('Update User avatar with invalid token', async () => {
            await api.updateUserAvatarInvalidToken(userId)
        })

        await test.step('Update User avatar without image file adding', async () => {
            await api.updateUserAvatarWithoutImage(userId, token)
        })
    })

    test('Delete User tests', async () => {
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
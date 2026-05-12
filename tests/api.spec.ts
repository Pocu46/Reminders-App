import { test, APIRequestContext } from '@playwright/test';
import { RemindersApiPage } from './pages/remindersApi.page';

test.describe('API Tests', () => {
    test('User Registration tests', async ({ request }: { request: APIRequestContext }) => {
        const api = new RemindersApiPage(request)
        await api.userRegistration()
        await api.clearUser()
    })
    test('User Login tests', async ({ request }: { request: APIRequestContext }) => {
        const api = new RemindersApiPage(request)
        await api.userCreate()
        await api.userLogin()
        await api.clearUser()
    })
})
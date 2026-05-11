import { test, APIRequestContext } from '@playwright/test';
import { RemindersApiPage } from './pages/remindersApi.page';

test.describe('API Tests', () => {
    test('User Registration tests', async ({ request }: { request: APIRequestContext }) => {
        const api = new RemindersApiPage(request)

        await test.step('Verify a new user registration', async () => {
            await api.userRegistration()
            await api.clearUser()
        })
    })
})
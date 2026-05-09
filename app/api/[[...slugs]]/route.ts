import { Elysia, t } from 'elysia'

export const app = new Elysia({ prefix: '/api' })
    .get('/', () => 'Hello Nextjs')
    .post('/user', ({ body }) => body, {
        body: t.Object({
            name: t.String(),
            email: t.String()
        })
    })

export type App = typeof app  // ← tambah ini

export const GET = app.fetch
export const POST = app.fetch
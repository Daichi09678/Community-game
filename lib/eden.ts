import { treaty } from '@elysiajs/eden'
import type { App } from '@/app/api/[[...slugs]]/route'  // ← pakai App bukan app

export const client = treaty<App>(
    typeof window === 'undefined' 
        ? `http://localhost:${process.env.PORT ?? 3000}` 
        : window.location.origin
)
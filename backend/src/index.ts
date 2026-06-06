import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { dashboardRoutes } from './routes/dashboard.route';
import { meRoutes } from './routes/me.route';

const app = new Elysia()
  .use(cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  }))
  .use(swagger({
    path: '/docs',
    documentation: {
      info: {
        title: 'Triablazer API',
        version: '1.0.0',
        description: 'Backend API for Triablazer Dashboard',
      },
    },
  }))
  .use(dashboardRoutes)
  .use(meRoutes)
  .get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }))
  .listen(3001);

console.log(`🦊 Elysia running at http://localhost:3001`);
console.log(`📚 Swagger docs at http://localhost:3001/docs`);
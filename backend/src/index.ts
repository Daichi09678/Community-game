import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { dashboardRoutes } from './routes/dashboard.route';
import { getConnection } from './lib/db/mysql';

// Initialize database connection
getConnection();

const app = new Elysia()
  .use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
  }))
  .get('/health', () => ({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Dashboard API is running'
  }))
  .use(dashboardRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Dashboard API running on http://localhost:${PORT}`);
  console.log(`📊 Endpoints:`);
  console.log(`   GET  /api/dashboard/stats`);
  console.log(`   GET  /api/dashboard/reports`);
  console.log(`   GET  /api/dashboard/top-reports`);
  console.log(`   GET  /api/dashboard/trending-tags`);
  console.log(`   GET  /api/dashboard/activity`);
  console.log(`   GET  /api/dashboard/game-coverage`);
  console.log(`   POST /api/dashboard/reports`);
});

export default app;
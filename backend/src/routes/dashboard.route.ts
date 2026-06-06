import { Elysia, t } from 'elysia';
import { DashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export const dashboardRoutes = new Elysia({ prefix: '/api/dashboard' })
  .use(authMiddleware)
  .get('/stats', DashboardController.getStats)
  .get('/reports', DashboardController.getReports, {
    query: t.Object({
      game: t.Optional(t.String()),
      type: t.Optional(t.String()),
      page: t.Optional(t.Numeric()),
      limit: t.Optional(t.Numeric())
    })
  })
  .get('/top-reports', DashboardController.getTopReports)
  .get('/trending-tags', DashboardController.getTrendingTags)
  .get('/activity', DashboardController.getActivityData)
  .get('/game-coverage', DashboardController.getGameCoverage);
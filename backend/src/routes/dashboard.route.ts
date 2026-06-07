// backend/src/routes/dashboard.route.ts
import { Elysia, t } from 'elysia';
import { DashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export const dashboardRoutes = new Elysia({ prefix: '/api/dashboard' })
  .use(authMiddleware)
  .get('/stats', () => DashboardController.getStats())
  // 🔥 DIPERBAIKI: Menambahkan parameter search di schema
  .get('/reports', ({ query }) => DashboardController.getReports({ query }), {
    query: t.Object({
      game: t.Optional(t.String()),
      type: t.Optional(t.String()),
      page: t.Optional(t.Numeric()),
      limit: t.Optional(t.Numeric()),
      search: t.Optional(t.String())
    })
  })
  .get('/top-reports', () => DashboardController.getTopReports())
  .get('/trending-tags', () => DashboardController.getTrendingTags())
  .get('/activity', () => DashboardController.getActivityData())
  .get('/game-coverage', () => DashboardController.getGameCoverage())
  .post('/reports', ({ body }) => DashboardController.createReport({ body }), {
    body: t.Object({
      title: t.String(),
      type: t.String(),
      game: t.String(),
      content: t.String(),
      userId: t.String(),
      version: t.Optional(t.String()),
      thumbnail: t.Optional(t.String()),
      tags: t.Optional(t.Array(t.String()))
    })
  });
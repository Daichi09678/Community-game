import { Elysia } from 'elysia';
import { authMiddleware } from '../middleware/auth.middleware';
import { queryOne } from '../lib/db/mysql';

export const meRoutes = new Elysia({ prefix: '/api/me' })
  .guard({
    async beforeHandle({ user, set }: any) {
      if (!user) {
        set.status = 401;
        return { error: 'Unauthorized' };
      }
    }
  })
  .use(authMiddleware)
  .get('/', async ({ user }: any) => {
    try {
      const userData = await queryOne(`
        SELECT 
          u.id,
          u.username,
          u.email,
          u.role,
          u.level,
          u.xp,
          u.rank,
          u.initials,
          up.avatar_color as avatarColor,
          up.title,
          (SELECT COUNT(*) FROM reports WHERE author_id = u.id) as totalReports,
          (SELECT COALESCE(SUM(votes), 0) FROM reports WHERE author_id = u.id) as totalVotes,
          (SELECT COUNT(*) FROM user_achievements WHERE user_id = u.id) as achievements
        FROM users u
        LEFT JOIN user_profiles up ON u.id = up.user_id
        WHERE u.id = ?
      `, [user.id]);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Error:', error);
      return { success: false, error: 'Failed to get user data' };
    }
  })
  .get('/stats', async ({ user }: any) => {
    try {
      const stats = await queryOne(`
        SELECT 
          u.level,
          u.xp,
          (SELECT COUNT(*) FROM reports WHERE author_id = u.id) as reportsCount,
          (SELECT COALESCE(SUM(votes), 0) FROM reports WHERE author_id = u.id) as votesReceived,
          (SELECT COUNT(*) FROM discussions WHERE author_id = u.id) as discussionsCount,
          (SELECT COUNT(*) FROM comments WHERE author_id = u.id) as commentsCount
        FROM users u
        WHERE u.id = ?
      `, [user.id]);
      
      return { success: true, stats };
    } catch (error) {
      console.error('Error:', error);
      return { success: false, error: 'Failed to get user stats' };
    }
  }); 
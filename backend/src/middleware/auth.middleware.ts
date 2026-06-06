import { Elysia } from 'elysia';

export const authMiddleware = new Elysia()
  .derive(({ request, set }) => {
    // Ambil user info dari header
    const userId = request.headers.get('x-user-id');
    const userEmail = request.headers.get('x-user-email');
    const userRole = request.headers.get('x-user-role');
    const username = request.headers.get('x-username');
    const userLevel = request.headers.get('x-user-level');
    const userRank = request.headers.get('x-user-rank');

    // Jika tidak ada user context
    if (!userId || !userEmail) {
      set.status = 401;
      return { 
        user: null 
      };
    }

    // Return user object
    return { 
      user: {
        id: userId,
        username: username || 'User',
        email: userEmail,
        role: userRole || 'user',
        level: parseInt(userLevel || '1'),
        rank: userRank || 'Novice Omni-Voyager',
      }
    };
  });
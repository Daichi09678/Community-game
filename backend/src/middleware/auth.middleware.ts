import { Elysia } from 'elysia';

export const authMiddleware = new Elysia()
  .derive(({ request, set, cookie }) => {
    // Get token from cookie or header
    const token = cookie.token?.value || request.headers.get('authorization')?.replace('Bearer ', '');
    
    // For development, you can use headers from frontend
    const userId = request.headers.get('x-user-id');
    const userEmail = request.headers.get('x-user-email');
    const userRole = request.headers.get('x-user-role');
    const username = request.headers.get('x-username');

    // In production, verify JWT token here
    if (!userId && !token) {
      // For public dashboard endpoints, return null user instead of 401
      return { 
        user: null,
        isAuthenticated: false
      };
    }

    return { 
      user: {
        id: userId || 'temp-user',
        username: username || 'Guest',
        email: userEmail || 'guest@example.com',
        role: userRole || 'user',
        level: 1,
        rank: 'Novice Omni-Voyager',
      },
      isAuthenticated: !!userId
    };
  });
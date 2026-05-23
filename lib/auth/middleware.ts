import { Elysia } from 'elysia';
import { auth } from './index';

export const authMacro = new Elysia({ name: 'auth-macro' })
  .macro({
    auth(enabled: boolean) {
      if (!enabled) return;
      return {
        async resolve({ request: { headers }, set }) {
          const session = await auth.api.getSession({ headers });

          if (!session) {
            set.status = 401;
            return { error: 'Unauthorized: Please login first' };
          }

          return { user: session.user, session: session.session };
        },
      };
    },

    adminOnly(enabled: boolean) {
      if (!enabled) return;
      return {
        async resolve({ request: { headers }, set }) {
          const session = await auth.api.getSession({ headers });

          if (!session) {
            set.status = 401;
            return { error: 'Unauthorized: Please login first' };
          }

          if ((session.user as any).role !== 'admin') {
            set.status = 403;
            return { error: 'Forbidden: Admin access required' };
          }

          return { user: session.user, session: session.session };
        },
      };
    },
  });
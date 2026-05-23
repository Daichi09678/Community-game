import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/lib/db';
import { users, sessions, accounts, verifications } from '@/lib/db/schema';
import { Resend } from 'resend';
import { randomUUID } from 'crypto';
import { getVerificationEmailHtml, getResetPasswordEmailHtml } from './email';

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  baseURL: process.env.APP_URL || 'http://localhost:3000',
  basePath: '/api/auth',
  secret: process.env.BETTER_AUTH_SECRET || 'your-secret-key-min-32-chars-long-here',

  database: drizzleAdapter(db, {
    provider: 'mysql',
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,

    sendResetPassword: async ({ user, url }) => {
      try {
        const html = getResetPasswordEmailHtml(url, user.name);
        await resend.emails.send({
          from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
          to: user.email,
          subject: 'Reset Password - Triablazer',
          html,
        });
      } catch (error) {
        console.error('Failed to send reset password email:', error);
      }
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, token }) => {
      try {
        const otp = token.slice(0, 6).toUpperCase();
        const html = getVerificationEmailHtml(otp, user.name);
        await resend.emails.send({
          from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
          to: user.email,
          subject: 'Verify Your Email - Triablazer',
          html,
        });
      } catch (error) {
        console.error('Failed to send verification email:', error);
        throw new Error('Failed to send verification email');
      }
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (userData) => {
          return {
            data: {
              ...userData,
              role: 'user',
            },
          };
        },
        after: async (user) => {
          console.log(`New user created: ${user.email}`);

          try {
            const { userProfiles } = await import('@/lib/db/schema');
            await db.insert(userProfiles).values({
              id: randomUUID(),
              userId: user.id,
              username: user.email.split('@')[0],
              level: 1,
              xp: 0,
              totalMissions: 0,
              totalReports: 0,
            });
          } catch (error) {
            console.warn('Could not create user profile:', error);
          }
        },
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  rateLimit: {
    enabled: true,
    window: 60,
    max: 10,
    customRules: {
      '/api/auth/sign-up': { window: 60, max: 3 },
      '/api/auth/sign-in': { window: 60, max: 5 },
    },
  },
});

export type Auth = typeof auth;
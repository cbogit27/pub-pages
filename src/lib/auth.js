import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/prisma';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          hd: "gmail.com",
          scope: 'openid email profile'
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Merge token and session data
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          role: token.role,
          isAdmin: token.role === 'ADMIN'
        }
      };
    },
    async jwt({ token, user, trigger }) {
      // Initial sign-in: fetch user data
      if (trigger === "signIn" || !token.role) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub || user.id },
          select: { role: true }
        });
        
        token.role = dbUser?.role || 'USER';
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Safe redirect handling
      const redirectUrl = url.startsWith(baseUrl) ? url : baseUrl;
      return Promise.resolve(redirectUrl);
    }
  },
  events: {
    async createUser({ user }) {
      // Atomic transaction for user setup
      await prisma.$transaction([
        prisma.profile.create({
          data: {
            userId: user.id,
            bio: '',
            avatar: '',
          }
        }),
        prisma.user.update({
          where: { id: user.id },
          data: { role: 'USER' }
        })
      ]);
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt',
    maxAge: 4 * 60 * 60 // 4 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
};

export default NextAuth(authOptions);
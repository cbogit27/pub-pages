import { PrismaClient } from '@prisma/client';

let prisma;

if (process.env.NODE_ENV === 'production') {
  // Use a single Prisma Client instance in production
  prisma = new PrismaClient();
} else {
  // Avoid instantiating multiple clients during development
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;

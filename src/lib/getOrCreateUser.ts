import { currentUser } from '@clerk/nextjs/server';
import { prisma } from './db';

export async function getOrCreateDbUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? '';
  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || null;

  const existing = await prisma.user.findUnique({ where: { id: clerkUser.id } });
  if (existing) {
    return prisma.user.update({
      where: { id: clerkUser.id },
      data: { email, ...(name ? { name } : {}) },
    });
  }

  if (email) {
    const byEmail = await prisma.user.findUnique({ where: { email } });
    if (byEmail) {
      return prisma.user.update({
        where: { email },
        data: { id: clerkUser.id, ...(name ? { name } : {}) },
      });
    }
  }

  return prisma.user.create({
    data: { id: clerkUser.id, email, name },
  });
}

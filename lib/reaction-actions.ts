"use server";
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function toggleReaction(postId: string, type: string = 'LIKE') {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Unauthorized' };
  const userId = session.user.id as string;
  const existing = await prisma.reaction.findFirst({ where: { postId, userId, type } });
  if (existing) {
    await prisma.reaction.delete({ where: { id: existing.id } });
    revalidatePath('/');
    return { ok: true, removed: true };
  }
  await prisma.reaction.create({ data: { postId, userId, type } });
  revalidatePath('/');
  return { ok: true };
}

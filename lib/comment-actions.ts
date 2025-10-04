"use server";
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const commentSchema = z.object({
  postId: z.string().cuid(),
  content: z.string().min(1).max(4000).transform(v => v.trim()),
  parentId: z.string().cuid().optional().nullable()
});

export async function createComment(input: { postId: string; content: string; parentId?: string | null }) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: 'Unauthorized' };
  }
  const parsed = commentSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: 'Invalid input', issues: parsed.error.issues };
  }
  const { postId, content, parentId } = parsed.data;
  // Ensure post exists
  const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true } });
  if (!post) return { ok: false, error: 'Post not found' };
  if (parentId) {
    const parent = await prisma.comment.findUnique({ where: { id: parentId } });
    if (!parent || parent.postId !== postId) return { ok: false, error: 'Invalid parent comment' };
  }
  const comment = await prisma.comment.create({
    data: {
      postId,
      parentId: parentId || null,
      content,
      authorId: session.user.id as string
    }
  });
  // Revalidate homepage feed and post detail page if slug known will be captured by dynamic path invalidation
  revalidatePath('/');
  revalidatePath(`/posts/${postId}`); // fallback; slug page will also fetch by slug route param
  return { ok: true, comment };
}

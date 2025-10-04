"use server";
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createPostSchema } from '@/lib/validation/post';
import slugify from 'slugify';
import { revalidatePath } from 'next/cache';

function uniqueSlug(base: string) {
  return slugify(base, { lower: true, strict: true });
}

export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: 'Unauthorized' };
  }
  const raw = {
    type: formData.get('type')?.toString() || 'STATUS',
    title: formData.get('title')?.toString() || '',
    content: formData.get('content')?.toString() || '',
    language: formData.get('language')?.toString() || undefined,
    tagsCsv: formData.get('tags')?.toString() || undefined
  };
  const parsed = createPostSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message || 'Invalid data' };
  const data = parsed.data;
  let slug: string | undefined = undefined;
  if (data.title) {
    slug = uniqueSlug(data.title);
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;
  }
  const tagNames = data.tagsCsv?.split(',').map(t => t.trim()).filter(Boolean) || [];
  const tagConnectOrCreate = tagNames.map(name => ({
    tag: {
      connectOrCreate: {
        where: { slug: slugify(name, { lower: true, strict: true }) },
        create: { name, slug: slugify(name, { lower: true, strict: true }) }
      }
    }
  }));

  const post = await prisma.post.create({
    data: {
      authorId: session.user.id as string,
      type: data.type,
      title: data.title || null,
      slug,
      content: data.content,
      language: data.language,
      tags: { create: tagConnectOrCreate }
    }
  });
  revalidatePath('/');
  return { ok: true, id: post.id };
}

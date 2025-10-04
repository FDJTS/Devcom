import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import type { Post, Reaction, PostTag, Tag, Profile, User } from '@prisma/client';

export interface FeedQueryOptions {
  limit?: number;
  cursor?: string | null;
  type?: string;
  tag?: string; // tag slug or name
}

export interface PostWithRelations extends Post {
  author: User & { profile: Profile | null };
  tags: (PostTag & { tag: Tag })[];
  reactions: Reaction[]; // not necessarily all after augmentation
  reactionCount?: number;
  reacted?: boolean;
}

export async function getFeed(opts: FeedQueryOptions = {}) {
  const session = await auth();
  const userId = session?.user?.id as string | undefined;
  const { limit = 10, cursor, type, tag } = opts;
  const where: any = {};
  if (type) where.type = type;
  if (tag) {
    where.tags = { some: { tag: { OR: [{ slug: tag }, { name: tag }] } } };
  }
  const postsRaw = await prisma.post.findMany({
    where,
    take: limit + 1,
    orderBy: { publishedAt: 'desc' },
    include: {
      author: { include: { profile: true } },
      reactions: true,
      ...(userId ? { reactions: { where: { userId } } } : {}),
      tags: { include: { tag: true } }
    },
    cursor: cursor ? { id: cursor } : undefined
  });
  // fetch full reaction set separately if we filtered above
  let posts = postsRaw;
  let reactedIds = new Set<string>();
  const ids = postsRaw.map((p: Post) => p.id);
  const counts = await prisma.reaction.groupBy({ by: ['postId'], _count: { _all: true }, where: { postId: { in: ids } } });
  const countMap = new Map(counts.map((c: any) => [c.postId, c._count._all]));
  if (userId) {
    const userReacts = await prisma.reaction.findMany({ where: { userId, postId: { in: ids } }, select: { postId: true } });
    reactedIds = new Set(userReacts.map((r: any) => r.postId));
  }
  posts = postsRaw.map((p: any) => Object.assign(p, { reactionCount: countMap.get(p.id) || 0, reacted: reactedIds.has(p.id) }));
  let nextCursor: string | null = null;
  if (posts.length > limit) {
    const next = posts.pop();
    nextCursor = next ? next.id : null;
  }
  return { posts, nextCursor };
}

import { prisma } from '@/lib/prisma';

export interface CommentNode {
  id: string;
  postId: string;
  parentId: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: { id: string; email: string | null; profile: { username: string | null; displayName: string | null } | null };
  children: CommentNode[];
}

export async function getCommentsForPost(postId: string): Promise<CommentNode[]> {
  const rows = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: 'asc' },
    include: { author: { include: { profile: true } } }
  });
  const byId: Record<string, CommentNode> = {};
  const roots: CommentNode[] = [];
  for (const c of rows) {
    byId[c.id] = {
      id: c.id,
      postId: c.postId,
      parentId: c.parentId,
      content: c.content,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      author: {
        id: c.author.id,
        email: c.author.email,
        profile: c.author.profile ? { username: c.author.profile.username, displayName: c.author.profile.displayName } : null
      },
      children: []
    };
  }
  for (const node of Object.values(byId)) {
    if (node.parentId && byId[node.parentId]) {
      byId[node.parentId].children.push(node);
    } else if (!node.parentId) {
      roots.push(node);
    }
  }
  return roots;
}

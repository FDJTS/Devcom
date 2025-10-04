const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database (JS fallback)...');
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversationMember.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.reaction.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.postTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.post.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Password123!', 10);

  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      passwordHash,
      profile: { create: { username: 'alice', displayName: 'Alice', bio: 'Full-stack dev', languagesCsv: 'ts,go' } }
    }
  });
  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      passwordHash,
      profile: { create: { username: 'bob', displayName: 'Bob', bio: 'Backend enthusiast', languagesCsv: 'rust,ts' } }
    }
  });

  await prisma.follow.create({ data: { followerId: alice.id, followingId: bob.id } });

  const tsTag = await prisma.tag.create({ data: { name: 'TypeScript', slug: 'typescript' } });
  const prismaTag = await prisma.tag.create({ data: { name: 'Prisma', slug: 'prisma' } });
  const nextTag = await prisma.tag.create({ data: { name: 'Next.js', slug: 'nextjs' } });

  const article = await prisma.post.create({
    data: {
      authorId: alice.id,
      type: 'ARTICLE',
      title: 'Getting Started with DevCom',
      slug: 'getting-started-devcom',
      content: '# DevCom\nThis is an example article explaining the platform.',
      excerpt: 'This is an example article explaining the platform.',
      tags: { create: [{ tagId: tsTag.id }, { tagId: nextTag.id }] }
    }
  });

  await prisma.post.create({
    data: {
      authorId: bob.id,
      type: 'SNIPPET',
      title: 'Prisma Query Example',
      slug: 'prisma-query-example',
      content: '```ts\nconst users = await prisma.user.findMany();\n```',
      language: 'ts',
      tags: { create: [{ tagId: prismaTag.id }] }
    }
  });

  await prisma.post.create({
    data: {
      authorId: alice.id,
      type: 'STATUS',
      content: 'Excited to build this community!'
    }
  });

  await prisma.post.create({
    data: {
      authorId: bob.id,
      type: 'PROJECT',
      title: 'Open Source Tooling',
      slug: 'open-source-tooling',
      content: 'Project placeholder description',
      projectMembers: { create: [{ userId: bob.id, role: 'owner' }, { userId: alice.id, role: 'contributor' }] }
    }
  });

  const comment = await prisma.comment.create({
    data: { postId: article.id, authorId: bob.id, content: 'Great overview! Looking forward to more.' }
  });

  await prisma.reaction.create({ data: { userId: bob.id, postId: article.id, type: 'LIKE' } });

  const conversation = await prisma.conversation.create({
    data: {
      isGroup: false,
      members: { create: [{ userId: alice.id }, { userId: bob.id }] },
      messages: { create: [{ senderId: alice.id, type: 'TEXT', body: 'Hey Bob, welcome!' }] }
    }
  });

  await prisma.notification.createMany({
    data: [
      { userId: alice.id, type: 'NEW_COMMENT', entityId: comment.id },
      { userId: bob.id, type: 'NEW_MESSAGE', entityId: conversation.id }
    ]
  });

  console.log('Seed complete. Users:', { alice: alice.email, bob: bob.email });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});


# DevCom (MVP Scaffold)

A collaborative developer community platform (inspired by dev.to + GitHub + blogging) focused on sharing knowledge, code, and discussions.

## Stack (planned)
- Next.js 15 (App Router, RSC, Server Actions)
- TypeScript
- Tailwind CSS (dark-mode first via `class` strategy)
- Prisma + PostgreSQL
- Auth.js (NextAuth) for authentication
- Zod for validation
- Shiki or Prism for syntax highlighting
- react-markdown + remark-gfm for rich content

## Roadmap (High-level)
1. Project scaffold (this commit)
2. Prisma schema & migrations
3. Auth (credentials + OAuth placeholder)
4. Post creation & global feed
5. Comments & reactions
6. Code snippets highlighting component
7. Messaging (non realtime first)
8. Notifications (basic)
9. Tests (feed + validation + auth)
10. Enhancements: realtime, search, project collab, repo integration, richer profiles

## Local Development

### Prerequisites
- Node.js >= 18.18
- pnpm or npm (choose one; examples use `npm`)
- PostgreSQL instance (local or cloud)

### Install & Run
```pwsh
npm install
npm run dev
```
Then open http://localhost:3000

### Seeded Credentials
After seeding (or using the provided SQLite dev.db) you can login with:

- alice@example.com / Password123!
- bob@example.com / Password123!

Or create a new account via the register form on the homepage.

### Environment Variables (`.env`)
Copy `.env.example` to `.env.local` and fill values.

## Planned Data Models (summary)
User, Profile, Post (article|snippet|project|status), Comment, Reaction, Follow, Conversation, Message, Notification, Tag, PostTag, ProjectMember plus Auth.js tables.

## License
MIT

## Status
Early scaffold. Expect rapid iteration.

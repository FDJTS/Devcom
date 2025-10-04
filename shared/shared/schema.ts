import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// Users table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  bio: text("bio"),
  skills: text("skills").array(),
  githubUrl: varchar("github_url"),
  twitterUrl: varchar("twitter_url"),
  websiteUrl: varchar("website_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Posts table
export const posts = pgTable("posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  authorId: varchar("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Articles table
export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  authorId: varchar("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  coverImage: varchar("cover_image"),
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  readTime: varchar("read_time").notNull(),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Code snippets table
export const snippets = pgTable("snippets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  authorId: varchar("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  code: text("code").notNull(),
  language: varchar("language").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Projects table
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  authorId: varchar("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  technologies: text("technologies").array().notNull().default(sql`ARRAY[]::text[]`),
  repositoryUrl: varchar("repository_url"),
  liveUrl: varchar("live_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Likes table (polymorphic - can like posts, articles, snippets, projects)
export const likes = pgTable("likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  targetType: varchar("target_type").notNull(), // 'post', 'article', 'snippet', 'project'
  targetId: varchar("target_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Comments table (polymorphic - can comment on posts, articles, snippets, projects)
export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  targetType: varchar("target_type").notNull(), // 'post', 'article', 'snippet', 'project'
  targetId: varchar("target_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Follows table
export const follows = pgTable("follows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  followerId: varchar("follower_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  followingId: varchar("following_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type").notNull(), // 'like', 'comment', 'follow'
  fromUserId: varchar("from_user_id").references(() => users.id, { onDelete: "cascade" }),
  targetType: varchar("target_type"),
  targetId: varchar("target_id"),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Types and schemas
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertPost = typeof posts.$inferInsert;
export type Post = typeof posts.$inferSelect;

export type InsertArticle = typeof articles.$inferInsert;
export type Article = typeof articles.$inferSelect;

export type InsertSnippet = typeof snippets.$inferInsert;
export type Snippet = typeof snippets.$inferSelect;

export type InsertProject = typeof projects.$inferInsert;
export type Project = typeof projects.$inferSelect;

export type InsertComment = typeof comments.$inferInsert;
export type Comment = typeof comments.$inferSelect;

export type InsertLike = typeof likes.$inferInsert;
export type Like = typeof likes.$inferSelect;

export type InsertFollow = typeof follows.$inferInsert;
export type Follow = typeof follows.$inferSelect;

export type Notification = typeof notifications.$inferSelect;

// Insert schemas for validation
export const insertPostSchema = createInsertSchema(posts).omit({ id: true, authorId: true, createdAt: true, updatedAt: true });
export const insertArticleSchema = createInsertSchema(articles).omit({ id: true, authorId: true, createdAt: true, updatedAt: true });
export const insertSnippetSchema = createInsertSchema(snippets).omit({ id: true, authorId: true, createdAt: true, updatedAt: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, authorId: true, createdAt: true, updatedAt: true });
export const insertCommentSchema = createInsertSchema(comments).omit({ id: true, userId: true, createdAt: true, updatedAt: true });
export const updateUserProfileSchema = createInsertSchema(users).pick({ bio: true, skills: true, githubUrl: true, twitterUrl: true, websiteUrl: true });

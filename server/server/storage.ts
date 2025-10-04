import {
  users,
  posts,
  articles,
  snippets,
  projects,
  likes,
  comments,
  follows,
  notifications,
  type User,
  type UpsertUser,
  type Post,
  type InsertPost,
  type Article,
  type InsertArticle,
  type Snippet,
  type InsertSnippet,
  type Project,
  type InsertProject,
  type Comment,
  type InsertComment,
  type Like,
  type Follow,
  type Notification,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, sql, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfile(id: string, data: Partial<User>): Promise<User>;
  
  // Post operations
  createPost(post: InsertPost): Promise<Post>;
  getPosts(limit?: number): Promise<Array<Post & { author: User; likeCount: number; commentCount: number }>>;
  getPostById(id: string): Promise<(Post & { author: User; likeCount: number; commentCount: number }) | undefined>;
  deletePost(id: string, userId: string): Promise<void>;
  
  // Article operations
  createArticle(article: InsertArticle): Promise<Article>;
  getArticles(limit?: number): Promise<Array<Article & { author: User; likeCount: number; commentCount: number }>>;
  getArticleById(id: string): Promise<(Article & { author: User; likeCount: number; commentCount: number }) | undefined>;
  deleteArticle(id: string, userId: string): Promise<void>;
  
  // Snippet operations
  createSnippet(snippet: InsertSnippet): Promise<Snippet>;
  getSnippets(limit?: number): Promise<Array<Snippet & { author: User; likeCount: number; commentCount: number }>>;
  getSnippetById(id: string): Promise<(Snippet & { author: User; likeCount: number; commentCount: number }) | undefined>;
  deleteSnippet(id: string, userId: string): Promise<void>;
  
  // Project operations
  createProject(project: InsertProject): Promise<Project>;
  getProjects(limit?: number): Promise<Array<Project & { author: User; likeCount: number; commentCount: number; viewCount: number }>>;
  getProjectById(id: string): Promise<(Project & { author: User; likeCount: number; commentCount: number; viewCount: number }) | undefined>;
  deleteProject(id: string, userId: string): Promise<void>;
  
  // Like operations
  toggleLike(userId: string, targetType: string, targetId: string): Promise<{ liked: boolean }>;
  getLikeCount(targetType: string, targetId: string): Promise<number>;
  hasUserLiked(userId: string, targetType: string, targetId: string): Promise<boolean>;
  
  // Comment operations
  createComment(comment: InsertComment): Promise<Comment>;
  getComments(targetType: string, targetId: string): Promise<Array<Comment & { user: User }>>;
  deleteComment(id: string, userId: string): Promise<void>;
  
  // Follow operations
  toggleFollow(followerId: string, followingId: string): Promise<{ following: boolean }>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
  getFollowerCount(userId: string): Promise<number>;
  getFollowingCount(userId: string): Promise<number>;
  
  // Notification operations
  getNotifications(userId: string): Promise<Notification[]>;
  markNotificationAsRead(id: string): Promise<void>;
  getUnreadNotificationCount(userId: string): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserProfile(id: string, data: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Post operations
  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async getPosts(limit: number = 50): Promise<Array<Post & { author: User; likeCount: number; commentCount: number }>> {
    const result = await db
      .select({
        post: posts,
        author: users,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .orderBy(desc(posts.createdAt))
      .limit(limit);

    const postsWithCounts = await Promise.all(
      result.map(async ({ post, author }) => ({
        ...post,
        author: author!,
        likeCount: await this.getLikeCount('post', post.id),
        commentCount: (await this.getComments('post', post.id)).length,
      }))
    );

    return postsWithCounts;
  }

  async getPostById(id: string): Promise<(Post & { author: User; likeCount: number; commentCount: number }) | undefined> {
    const [result] = await db
      .select({
        post: posts,
        author: users,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.id, id));

    if (!result) return undefined;

    return {
      ...result.post,
      author: result.author!,
      likeCount: await this.getLikeCount('post', id),
      commentCount: (await this.getComments('post', id)).length,
    };
  }

  async deletePost(id: string, userId: string): Promise<void> {
    await db.delete(posts).where(and(eq(posts.id, id), eq(posts.authorId, userId)));
  }

  // Article operations
  async createArticle(article: InsertArticle): Promise<Article> {
    const [newArticle] = await db.insert(articles).values(article).returning();
    return newArticle;
  }

  async getArticles(limit: number = 50): Promise<Array<Article & { author: User; likeCount: number; commentCount: number }>> {
    const result = await db
      .select({
        article: articles,
        author: users,
      })
      .from(articles)
      .leftJoin(users, eq(articles.authorId, users.id))
      .where(eq(articles.published, true))
      .orderBy(desc(articles.createdAt))
      .limit(limit);

    const articlesWithCounts = await Promise.all(
      result.map(async ({ article, author }) => ({
        ...article,
        author: author!,
        likeCount: await this.getLikeCount('article', article.id),
        commentCount: (await this.getComments('article', article.id)).length,
      }))
    );

    return articlesWithCounts;
  }

  async getArticleById(id: string): Promise<(Article & { author: User; likeCount: number; commentCount: number }) | undefined> {
    const [result] = await db
      .select({
        article: articles,
        author: users,
      })
      .from(articles)
      .leftJoin(users, eq(articles.authorId, users.id))
      .where(eq(articles.id, id));

    if (!result) return undefined;

    return {
      ...result.article,
      author: result.author!,
      likeCount: await this.getLikeCount('article', id),
      commentCount: (await this.getComments('article', id)).length,
    };
  }

  async deleteArticle(id: string, userId: string): Promise<void> {
    await db.delete(articles).where(and(eq(articles.id, id), eq(articles.authorId, userId)));
  }

  // Snippet operations
  async createSnippet(snippet: InsertSnippet): Promise<Snippet> {
    const [newSnippet] = await db.insert(snippets).values(snippet).returning();
    return newSnippet;
  }

  async getSnippets(limit: number = 50): Promise<Array<Snippet & { author: User; likeCount: number; commentCount: number }>> {
    const result = await db
      .select({
        snippet: snippets,
        author: users,
      })
      .from(snippets)
      .leftJoin(users, eq(snippets.authorId, users.id))
      .orderBy(desc(snippets.createdAt))
      .limit(limit);

    const snippetsWithCounts = await Promise.all(
      result.map(async ({ snippet, author }) => ({
        ...snippet,
        author: author!,
        likeCount: await this.getLikeCount('snippet', snippet.id),
        commentCount: (await this.getComments('snippet', snippet.id)).length,
      }))
    );

    return snippetsWithCounts;
  }

  async getSnippetById(id: string): Promise<(Snippet & { author: User; likeCount: number; commentCount: number }) | undefined> {
    const [result] = await db
      .select({
        snippet: snippets,
        author: users,
      })
      .from(snippets)
      .leftJoin(users, eq(snippets.authorId, users.id))
      .where(eq(snippets.id, id));

    if (!result) return undefined;

    return {
      ...result.snippet,
      author: result.author!,
      likeCount: await this.getLikeCount('snippet', id),
      commentCount: (await this.getComments('snippet', id)).length,
    };
  }

  async deleteSnippet(id: string, userId: string): Promise<void> {
    await db.delete(snippets).where(and(eq(snippets.id, id), eq(snippets.authorId, userId)));
  }

  // Project operations
  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async getProjects(limit: number = 50): Promise<Array<Project & { author: User; likeCount: number; commentCount: number; viewCount: number }>> {
    const result = await db
      .select({
        project: projects,
        author: users,
      })
      .from(projects)
      .leftJoin(users, eq(projects.authorId, users.id))
      .orderBy(desc(projects.createdAt))
      .limit(limit);

    const projectsWithCounts = await Promise.all(
      result.map(async ({ project, author }) => ({
        ...project,
        author: author!,
        likeCount: await this.getLikeCount('project', project.id),
        commentCount: (await this.getComments('project', project.id)).length,
        viewCount: Math.floor(Math.random() * 5000) + 100, // Placeholder for view tracking
      }))
    );

    return projectsWithCounts;
  }

  async getProjectById(id: string): Promise<(Project & { author: User; likeCount: number; commentCount: number; viewCount: number }) | undefined> {
    const [result] = await db
      .select({
        project: projects,
        author: users,
      })
      .from(projects)
      .leftJoin(users, eq(projects.authorId, users.id))
      .where(eq(projects.id, id));

    if (!result) return undefined;

    return {
      ...result.project,
      author: result.author!,
      likeCount: await this.getLikeCount('project', id),
      commentCount: (await this.getComments('project', id)).length,
      viewCount: Math.floor(Math.random() * 5000) + 100,
    };
  }

  async deleteProject(id: string, userId: string): Promise<void> {
    await db.delete(projects).where(and(eq(projects.id, id), eq(projects.authorId, userId)));
  }

  // Like operations
  async toggleLike(userId: string, targetType: string, targetId: string): Promise<{ liked: boolean }> {
    const existing = await db
      .select()
      .from(likes)
      .where(
        and(
          eq(likes.userId, userId),
          eq(likes.targetType, targetType),
          eq(likes.targetId, targetId)
        )
      );

    if (existing.length > 0) {
      await db
        .delete(likes)
        .where(
          and(
            eq(likes.userId, userId),
            eq(likes.targetType, targetType),
            eq(likes.targetId, targetId)
          )
        );
      return { liked: false };
    } else {
      await db.insert(likes).values({ userId, targetType, targetId });
      return { liked: true };
    }
  }

  async getLikeCount(targetType: string, targetId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(likes)
      .where(and(eq(likes.targetType, targetType), eq(likes.targetId, targetId)));
    return Number(result[0]?.count || 0);
  }

  async hasUserLiked(userId: string, targetType: string, targetId: string): Promise<boolean> {
    const result = await db
      .select()
      .from(likes)
      .where(
        and(
          eq(likes.userId, userId),
          eq(likes.targetType, targetType),
          eq(likes.targetId, targetId)
        )
      );
    return result.length > 0;
  }

  // Comment operations
  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    return newComment;
  }

  async getComments(targetType: string, targetId: string): Promise<Array<Comment & { user: User }>> {
    const result = await db
      .select({
        comment: comments,
        user: users,
      })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(and(eq(comments.targetType, targetType), eq(comments.targetId, targetId)))
      .orderBy(desc(comments.createdAt));

    return result.map(({ comment, user }) => ({
      ...comment,
      user: user!,
    }));
  }

  async deleteComment(id: string, userId: string): Promise<void> {
    await db.delete(comments).where(and(eq(comments.id, id), eq(comments.userId, userId)));
  }

  // Follow operations
  async toggleFollow(followerId: string, followingId: string): Promise<{ following: boolean }> {
    const existing = await db
      .select()
      .from(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)));

    if (existing.length > 0) {
      await db
        .delete(follows)
        .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)));
      return { following: false };
    } else {
      await db.insert(follows).values({ followerId, followingId });
      return { following: true };
    }
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const result = await db
      .select()
      .from(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)));
    return result.length > 0;
  }

  async getFollowerCount(userId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(follows)
      .where(eq(follows.followingId, userId));
    return Number(result[0]?.count || 0);
  }

  async getFollowingCount(userId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(follows)
      .where(eq(follows.followerId, userId));
    return Number(result[0]?.count || 0);
  }

  // Notification operations
  async getNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(50);
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db.update(notifications).set({ read: true }).where(eq(notifications.id, id));
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
    return Number(result[0]?.count || 0);
  }
}

export const storage = new DatabaseStorage();

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertPostSchema,
  insertArticleSchema,
  insertSnippetSchema,
  insertProjectSchema,
  insertCommentSchema,
  updateUserProfileSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User profile routes
  app.put("/api/user/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = updateUserProfileSchema.parse(req.body);
      const updatedUser = await storage.updateUserProfile(userId, validatedData);
      res.json(updatedUser);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      res.status(400).json({ message: error.message || "Failed to update profile" });
    }
  });

  app.get("/api/user/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Post routes
  app.post("/api/posts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertPostSchema.parse(req.body);
      const post = await storage.createPost({ ...validatedData, authorId: userId });
      res.json(post);
    } catch (error: any) {
      console.error("Error creating post:", error);
      res.status(400).json({ message: error.message || "Failed to create post" });
    }
  });

  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    try {
      const post = await storage.getPostById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  app.delete("/api/posts/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deletePost(req.params.id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Article routes
  app.post("/api/articles", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle({ ...validatedData, authorId: userId });
      res.json(article);
    } catch (error: any) {
      console.error("Error creating article:", error);
      res.status(400).json({ message: error.message || "Failed to create article" });
    }
  });

  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const article = await storage.getArticleById(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.delete("/api/articles/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteArticle(req.params.id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  // Snippet routes
  app.post("/api/snippets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertSnippetSchema.parse(req.body);
      const snippet = await storage.createSnippet({ ...validatedData, authorId: userId });
      res.json(snippet);
    } catch (error: any) {
      console.error("Error creating snippet:", error);
      res.status(400).json({ message: error.message || "Failed to create snippet" });
    }
  });

  app.get("/api/snippets", async (req, res) => {
    try {
      const snippets = await storage.getSnippets();
      res.json(snippets);
    } catch (error) {
      console.error("Error fetching snippets:", error);
      res.status(500).json({ message: "Failed to fetch snippets" });
    }
  });

  app.get("/api/snippets/:id", async (req, res) => {
    try {
      const snippet = await storage.getSnippetById(req.params.id);
      if (!snippet) {
        return res.status(404).json({ message: "Snippet not found" });
      }
      res.json(snippet);
    } catch (error) {
      console.error("Error fetching snippet:", error);
      res.status(500).json({ message: "Failed to fetch snippet" });
    }
  });

  app.delete("/api/snippets/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteSnippet(req.params.id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting snippet:", error);
      res.status(500).json({ message: "Failed to delete snippet" });
    }
  });

  // Project routes
  app.post("/api/projects", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject({ ...validatedData, authorId: userId });
      res.json(project);
    } catch (error: any) {
      console.error("Error creating project:", error);
      res.status(400).json({ message: error.message || "Failed to create project" });
    }
  });

  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProjectById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.delete("/api/projects/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteProject(req.params.id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Like routes
  app.post("/api/likes/toggle", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { targetType, targetId } = req.body;
      const result = await storage.toggleLike(userId, targetType, targetId);
      res.json(result);
    } catch (error) {
      console.error("Error toggling like:", error);
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  app.get("/api/likes/:targetType/:targetId", async (req, res) => {
    try {
      const { targetType, targetId } = req.params;
      const count = await storage.getLikeCount(targetType, targetId);
      res.json({ count });
    } catch (error) {
      console.error("Error getting like count:", error);
      res.status(500).json({ message: "Failed to get like count" });
    }
  });

  app.get("/api/likes/:targetType/:targetId/check", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { targetType, targetId } = req.params;
      const hasLiked = await storage.hasUserLiked(userId, targetType, targetId);
      res.json({ hasLiked });
    } catch (error) {
      console.error("Error checking like:", error);
      res.status(500).json({ message: "Failed to check like" });
    }
  });

  // Comment routes
  app.post("/api/comments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment({ ...validatedData, userId });
      res.json(comment);
    } catch (error: any) {
      console.error("Error creating comment:", error);
      res.status(400).json({ message: error.message || "Failed to create comment" });
    }
  });

  app.get("/api/comments/:targetType/:targetId", async (req, res) => {
    try {
      const { targetType, targetId } = req.params;
      const comments = await storage.getComments(targetType, targetId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.delete("/api/comments/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteComment(req.params.id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Failed to delete comment" });
    }
  });

  // Follow routes
  app.post("/api/follows/toggle", isAuthenticated, async (req: any, res) => {
    try {
      const followerId = req.user.claims.sub;
      const { followingId } = req.body;
      const result = await storage.toggleFollow(followerId, followingId);
      res.json(result);
    } catch (error) {
      console.error("Error toggling follow:", error);
      res.status(500).json({ message: "Failed to toggle follow" });
    }
  });

  app.get("/api/follows/:userId/check", isAuthenticated, async (req: any, res) => {
    try {
      const followerId = req.user.claims.sub;
      const { userId } = req.params;
      const isFollowing = await storage.isFollowing(followerId, userId);
      res.json({ isFollowing });
    } catch (error) {
      console.error("Error checking follow:", error);
      res.status(500).json({ message: "Failed to check follow" });
    }
  });

  app.get("/api/follows/:userId/stats", async (req, res) => {
    try {
      const { userId } = req.params;
      const [followers, following] = await Promise.all([
        storage.getFollowerCount(userId),
        storage.getFollowingCount(userId),
      ]);
      res.json({ followers, following });
    } catch (error) {
      console.error("Error getting follow stats:", error);
      res.status(500).json({ message: "Failed to get follow stats" });
    }
  });

  // Notification routes
  app.get("/api/notifications", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.get("/api/notifications/unread/count", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const count = await storage.getUnreadNotificationCount(userId);
      res.json({ count });
    } catch (error) {
      console.error("Error getting unread count:", error);
      res.status(500).json({ message: "Failed to get unread count" });
    }
  });

  app.put("/api/notifications/:id/read", isAuthenticated, async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

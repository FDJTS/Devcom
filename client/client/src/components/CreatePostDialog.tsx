import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenSquare, Code2, FileText, FolderGit2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export function CreatePostDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Post states
  const [postContent, setPostContent] = useState("");
  const [postTags, setPostTags] = useState("");

  // Snippet states
  const [snippetTitle, setSnippetTitle] = useState("");
  const [snippetDescription, setSnippetDescription] = useState("");
  const [snippetCode, setSnippetCode] = useState("");
  const [snippetLanguage, setSnippetLanguage] = useState("javascript");

  // Article states
  const [articleTitle, setArticleTitle] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [articleTags, setArticleTags] = useState("");

  // Project states
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectTechnologies, setProjectTechnologies] = useState("");
  const [projectRepoUrl, setProjectRepoUrl] = useState("");
  const [projectLiveUrl, setProjectLiveUrl] = useState("");

  const createPostMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.status === 401) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        throw new Error("Unauthorized");
      }
      if (!response.ok) throw new Error("Failed to create post");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({ title: "Post created successfully!" });
      setPostContent("");
      setPostTags("");
      setOpen(false);
    },
    onError: (error: Error) => {
      if (error.message !== "Unauthorized") {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    },
  });

  const createSnippetMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.status === 401) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        throw new Error("Unauthorized");
      }
      if (!response.ok) throw new Error("Failed to create snippet");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/snippets"] });
      toast({ title: "Snippet created successfully!" });
      setSnippetTitle("");
      setSnippetDescription("");
      setSnippetCode("");
      setOpen(false);
    },
    onError: (error: Error) => {
      if (error.message !== "Unauthorized") {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    },
  });

  const createArticleMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.status === 401) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        throw new Error("Unauthorized");
      }
      if (!response.ok) throw new Error("Failed to create article");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({ title: "Article created successfully!" });
      setArticleTitle("");
      setArticleContent("");
      setArticleTags("");
      setOpen(false);
    },
    onError: (error: Error) => {
      if (error.message !== "Unauthorized") {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.status === 401) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        throw new Error("Unauthorized");
      }
      if (!response.ok) throw new Error("Failed to create project");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project created successfully!" });
      setProjectName("");
      setProjectDescription("");
      setProjectTechnologies("");
      setProjectRepoUrl("");
      setProjectLiveUrl("");
      setOpen(false);
    },
    onError: (error: Error) => {
      if (error.message !== "Unauthorized") {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    },
  });

  const handleCreatePost = () => {
    if (!postContent.trim()) {
      toast({ title: "Error", description: "Post content is required", variant: "destructive" });
      return;
    }
    createPostMutation.mutate({
      content: postContent,
      tags: postTags.split(',').map(t => t.trim()).filter(Boolean),
    });
  };

  const handleCreateSnippet = () => {
    if (!snippetTitle.trim() || !snippetCode.trim()) {
      toast({ title: "Error", description: "Title and code are required", variant: "destructive" });
      return;
    }
    createSnippetMutation.mutate({
      title: snippetTitle,
      description: snippetDescription,
      code: snippetCode,
      language: snippetLanguage,
    });
  };

  const handleCreateArticle = () => {
    if (!articleTitle.trim() || !articleContent.trim()) {
      toast({ title: "Error", description: "Title and content are required", variant: "destructive" });
      return;
    }
    const excerpt = articleContent.slice(0, 200) + (articleContent.length > 200 ? '...' : '');
    const wordCount = articleContent.split(/\s+/).length;
    const readTime = `${Math.ceil(wordCount / 200)} min read`;
    
    createArticleMutation.mutate({
      title: articleTitle,
      content: articleContent,
      excerpt,
      tags: articleTags.split(',').map(t => t.trim()).filter(Boolean),
      readTime,
      published: true,
    });
  };

  const handleCreateProject = () => {
    if (!projectName.trim() || !projectDescription.trim()) {
      toast({ title: "Error", description: "Name and description are required", variant: "destructive" });
      return;
    }
    createProjectMutation.mutate({
      name: projectName,
      description: projectDescription,
      technologies: projectTechnologies.split(',').map(t => t.trim()).filter(Boolean),
      repositoryUrl: projectRepoUrl || null,
      liveUrl: projectLiveUrl || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-create-dialog">
          <PenSquare className="mr-2 h-4 w-4" />
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Content</DialogTitle>
          <DialogDescription>
            Share your thoughts, code, articles, or projects with the community
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="post" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="post" className="gap-2" data-testid="tab-post">
              <PenSquare className="h-4 w-4" />
              Post
            </TabsTrigger>
            <TabsTrigger value="snippet" className="gap-2" data-testid="tab-snippet">
              <Code2 className="h-4 w-4" />
              Snippet
            </TabsTrigger>
            <TabsTrigger value="article" className="gap-2" data-testid="tab-article">
              <FileText className="h-4 w-4" />
              Article
            </TabsTrigger>
            <TabsTrigger value="project" className="gap-2" data-testid="tab-project">
              <FolderGit2 className="h-4 w-4" />
              Project
            </TabsTrigger>
          </TabsList>

          <TabsContent value="post" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="post-content">What's on your mind?</Label>
              <Textarea
                id="post-content"
                placeholder="Share your thoughts with the community..."
                className="min-h-[200px] resize-none"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                data-testid="textarea-post-content"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                placeholder="e.g. react, typescript, webdev"
                value={postTags}
                onChange={(e) => setPostTags(e.target.value)}
                data-testid="input-tags"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)} data-testid="button-cancel">
                Cancel
              </Button>
              <Button
                onClick={handleCreatePost}
                disabled={createPostMutation.isPending}
                data-testid="button-publish"
              >
                {createPostMutation.isPending ? "Publishing..." : "Publish Post"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="snippet" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="snippet-title">Title</Label>
              <Input
                id="snippet-title"
                placeholder="Give your snippet a descriptive title"
                value={snippetTitle}
                onChange={(e) => setSnippetTitle(e.target.value)}
                data-testid="input-snippet-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="snippet-description">Description</Label>
              <Input
                id="snippet-description"
                placeholder="Briefly describe what this code does"
                value={snippetDescription}
                onChange={(e) => setSnippetDescription(e.target.value)}
                data-testid="input-snippet-description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="snippet-language">Language</Label>
              <Input
                id="snippet-language"
                placeholder="e.g. javascript, python, typescript"
                value={snippetLanguage}
                onChange={(e) => setSnippetLanguage(e.target.value)}
                data-testid="input-snippet-language"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="snippet-code">Code</Label>
              <Textarea
                id="snippet-code"
                placeholder="Paste your code here..."
                className="min-h-[200px] resize-none font-mono text-sm"
                value={snippetCode}
                onChange={(e) => setSnippetCode(e.target.value)}
                data-testid="textarea-snippet-code"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)} data-testid="button-cancel">
                Cancel
              </Button>
              <Button
                onClick={handleCreateSnippet}
                disabled={createSnippetMutation.isPending}
                data-testid="button-publish"
              >
                {createSnippetMutation.isPending ? "Sharing..." : "Share Snippet"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="article" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="article-title">Title</Label>
              <Input
                id="article-title"
                placeholder="An engaging title for your article"
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
                data-testid="input-article-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="article-tags">Tags (comma separated)</Label>
              <Input
                id="article-tags"
                placeholder="e.g. react, typescript, tutorial"
                value={articleTags}
                onChange={(e) => setArticleTags(e.target.value)}
                data-testid="input-article-tags"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="article-content">Content</Label>
              <Textarea
                id="article-content"
                placeholder="Start writing your article... (Markdown supported)"
                className="min-h-[300px] resize-none"
                value={articleContent}
                onChange={(e) => setArticleContent(e.target.value)}
                data-testid="textarea-article-content"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)} data-testid="button-cancel">
                Cancel
              </Button>
              <Button
                onClick={handleCreateArticle}
                disabled={createArticleMutation.isPending}
                data-testid="button-publish"
              >
                {createArticleMutation.isPending ? "Publishing..." : "Publish Article"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="project" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                placeholder="Your awesome project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                data-testid="input-project-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                placeholder="Describe what your project does"
                className="min-h-[150px] resize-none"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                data-testid="textarea-project-description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-technologies">Technologies (comma separated)</Label>
              <Input
                id="project-technologies"
                placeholder="e.g. React, TypeScript, Node.js"
                value={projectTechnologies}
                onChange={(e) => setProjectTechnologies(e.target.value)}
                data-testid="input-project-technologies"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-repo">Repository URL (optional)</Label>
              <Input
                id="project-repo"
                type="url"
                placeholder="https://github.com/username/project"
                value={projectRepoUrl}
                onChange={(e) => setProjectRepoUrl(e.target.value)}
                data-testid="input-project-repo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-live">Live URL (optional)</Label>
              <Input
                id="project-live"
                type="url"
                placeholder="https://yourproject.com"
                value={projectLiveUrl}
                onChange={(e) => setProjectLiveUrl(e.target.value)}
                data-testid="input-project-live"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)} data-testid="button-cancel">
                Cancel
              </Button>
              <Button
                onClick={handleCreateProject}
                disabled={createProjectMutation.isPending}
                data-testid="button-publish"
              >
                {createProjectMutation.isPending ? "Sharing..." : "Share Project"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

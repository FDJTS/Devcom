import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";
import { ArticleCard } from "@/components/ArticleCard";
import { CodeSnippetCard } from "@/components/CodeSnippetCard";
import { ProjectCard } from "@/components/ProjectCard";
import { TrendingTags } from "@/components/TrendingTags";
import { FeaturedDevelopers } from "@/components/FeaturedDevelopers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, FileText, Code2, FolderGit2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Post, Article, Snippet, Project } from "@shared/schema";

type PostWithAuthor = Post & {
  author: { id: string; firstName: string | null; lastName: string | null; profileImageUrl: string | null };
  likeCount: number;
  commentCount: number;
};

type ArticleWithAuthor = Article & {
  author: { id: string; firstName: string | null; lastName: string | null; profileImageUrl: string | null };
  likeCount: number;
  commentCount: number;
};

type SnippetWithAuthor = Snippet & {
  author: { id: string; firstName: string | null; lastName: string | null; profileImageUrl: string | null };
  likeCount: number;
  commentCount: number;
};

type ProjectWithAuthor = Project & {
  author: { id: string; firstName: string | null; lastName: string | null; profileImageUrl: string | null };
  likeCount: number;
  commentCount: number;
  viewCount: number;
};

export default function Home() {
  const { data: posts = [], isLoading: postsLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ["/api/posts"],
  });

  const { data: articles = [], isLoading: articlesLoading } = useQuery<ArticleWithAuthor[]>({
    queryKey: ["/api/articles"],
  });

  const { data: snippets = [], isLoading: snippetsLoading } = useQuery<SnippetWithAuthor[]>({
    queryKey: ["/api/snippets"],
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery<ProjectWithAuthor[]>({
    queryKey: ["/api/projects"],
  });

  const formatTimeAgo = (date: Date | null | undefined) => {
    if (!date) return "recently";
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const allContent = [
    ...posts.map(p => ({ ...p, type: 'post', createdAt: p.createdAt })),
    ...articles.map(a => ({ ...a, type: 'article', createdAt: a.createdAt })),
    ...snippets.map(s => ({ ...s, type: 'snippet', createdAt: s.createdAt })),
    ...projects.map(p => ({ ...p, type: 'project', createdAt: p.createdAt })),
  ].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6 w-full justify-start">
                <TabsTrigger value="all" className="gap-2" data-testid="tab-all">
                  <Flame className="h-4 w-4" />
                  All
                </TabsTrigger>
                <TabsTrigger value="articles" className="gap-2" data-testid="tab-articles">
                  <FileText className="h-4 w-4" />
                  Articles
                </TabsTrigger>
                <TabsTrigger value="snippets" className="gap-2" data-testid="tab-snippets">
                  <Code2 className="h-4 w-4" />
                  Snippets
                </TabsTrigger>
                <TabsTrigger value="projects" className="gap-2" data-testid="tab-projects">
                  <FolderGit2 className="h-4 w-4" />
                  Projects
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                {postsLoading || articlesLoading || snippetsLoading || projectsLoading ? (
                  <div className="text-center py-12 text-muted-foreground">Loading...</div>
                ) : allContent.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="text-lg font-medium mb-2">No content yet</p>
                    <p>Be the first to share something with the community!</p>
                  </div>
                ) : (
                  allContent.map((item: any) => {
                    if (item.type === 'post') {
                      return (
                        <PostCard
                          key={item.id}
                          id={item.id}
                          author={{
                            name: `${item.author.firstName || ''} ${item.author.lastName || ''}`.trim() || 'Anonymous',
                            username: item.author.id,
                            avatar: item.author.profileImageUrl || '',
                          }}
                          content={item.content}
                          tags={item.tags || []}
                          likes={item.likeCount}
                          comments={item.commentCount}
                          timestamp={formatTimeAgo(item.createdAt)}
                        />
                      );
                    }
                    if (item.type === 'article') {
                      return (
                        <ArticleCard
                          key={item.id}
                          id={item.id}
                          title={item.title}
                          excerpt={item.excerpt}
                          author={{
                            name: `${item.author.firstName || ''} ${item.author.lastName || ''}`.trim() || 'Anonymous',
                            username: item.author.id,
                            avatar: item.author.profileImageUrl || '',
                          }}
                          coverImage={item.coverImage || ''}
                          tags={item.tags || []}
                          likes={item.likeCount}
                          comments={item.commentCount}
                          readTime={item.readTime}
                          publishedAt={formatTimeAgo(item.createdAt)}
                        />
                      );
                    }
                    if (item.type === 'snippet') {
                      return (
                        <CodeSnippetCard
                          key={item.id}
                          id={item.id}
                          title={item.title}
                          description={item.description}
                          code={item.code}
                          language={item.language}
                          author={{
                            name: `${item.author.firstName || ''} ${item.author.lastName || ''}`.trim() || 'Anonymous',
                            username: item.author.id,
                            avatar: item.author.profileImageUrl || '',
                          }}
                          likes={item.likeCount}
                          comments={item.commentCount}
                          timestamp={formatTimeAgo(item.createdAt)}
                        />
                      );
                    }
                    if (item.type === 'project') {
                      return (
                        <ProjectCard
                          key={item.id}
                          id={item.id}
                          name={item.name}
                          description={item.description}
                          author={{
                            name: `${item.author.firstName || ''} ${item.author.lastName || ''}`.trim() || 'Anonymous',
                            username: item.author.id,
                            avatar: item.author.profileImageUrl || '',
                          }}
                          technologies={item.technologies || []}
                          stars={item.likeCount}
                          forks={0}
                          views={item.viewCount}
                          updatedAt={formatTimeAgo(item.updatedAt)}
                        />
                      );
                    }
                    return null;
                  })
                )}
              </TabsContent>

              <TabsContent value="articles" className="space-y-6">
                {articlesLoading ? (
                  <div className="text-center py-12 text-muted-foreground">Loading articles...</div>
                ) : articles.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="text-lg font-medium mb-2">No articles yet</p>
                    <p>Write the first article and share your knowledge!</p>
                  </div>
                ) : (
                  articles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      id={article.id}
                      title={article.title}
                      excerpt={article.excerpt}
                      author={{
                        name: `${article.author.firstName || ''} ${article.author.lastName || ''}`.trim() || 'Anonymous',
                        username: article.author.id,
                        avatar: article.author.profileImageUrl || '',
                      }}
                      coverImage={article.coverImage || ''}
                      tags={article.tags || []}
                      likes={article.likeCount}
                      comments={article.commentCount}
                      readTime={article.readTime}
                      publishedAt={formatTimeAgo(article.createdAt)}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="snippets" className="space-y-6">
                {snippetsLoading ? (
                  <div className="text-center py-12 text-muted-foreground">Loading snippets...</div>
                ) : snippets.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="text-lg font-medium mb-2">No code snippets yet</p>
                    <p>Share your first code snippet with the community!</p>
                  </div>
                ) : (
                  snippets.map((snippet) => (
                    <CodeSnippetCard
                      key={snippet.id}
                      id={snippet.id}
                      title={snippet.title}
                      description={snippet.description}
                      code={snippet.code}
                      language={snippet.language}
                      author={{
                        name: `${snippet.author.firstName || ''} ${snippet.author.lastName || ''}`.trim() || 'Anonymous',
                        username: snippet.author.id,
                        avatar: snippet.author.profileImageUrl || '',
                      }}
                      likes={snippet.likeCount}
                      comments={snippet.commentCount}
                      timestamp={formatTimeAgo(snippet.createdAt)}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="projects" className="space-y-6">
                {projectsLoading ? (
                  <div className="text-center py-12 text-muted-foreground">Loading projects...</div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="text-lg font-medium mb-2">No projects yet</p>
                    <p>Showcase your first project to the community!</p>
                  </div>
                ) : (
                  projects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      id={project.id}
                      name={project.name}
                      description={project.description}
                      author={{
                        name: `${project.author.firstName || ''} ${project.author.lastName || ''}`.trim() || 'Anonymous',
                        username: project.author.id,
                        avatar: project.author.profileImageUrl || '',
                      }}
                      technologies={project.technologies || []}
                      stars={project.likeCount}
                      forks={0}
                      views={project.viewCount}
                      updatedAt={formatTimeAgo(project.updatedAt)}
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6 lg:col-span-4">
            <TrendingTags />
            <FeaturedDevelopers />
          </div>
        </div>
      </div>
    </div>
  );
}

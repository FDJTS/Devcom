import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Github, Twitter, Globe, MapPin, Calendar, Users } from "lucide-react";
import type { User } from "@shared/schema";

export default function Profile() {
  const [, params] = useRoute("/profile/:id");
  const userId = params?.id;

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/user", userId],
    enabled: !!userId,
  });

  const { data: stats } = useQuery<{ followers: number; following: number }>({
    queryKey: ["/api/follows", userId, "stats"],
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto flex h-[calc(100vh-4rem)] items-center justify-center px-4">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto flex h-[calc(100vh-4rem)] items-center justify-center px-4">
          <p className="text-muted-foreground">User not found</p>
        </div>
      </div>
    );
  }

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-6xl px-4 py-8 md:px-6">
        <Card className="p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row">
            <Avatar className="h-32 w-32">
              <AvatarImage src={user.profileImageUrl || ''} />
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                {fullName[0] || '?'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h1 className="mb-1 text-3xl font-bold tracking-tight">{fullName}</h1>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              </div>

              {user.bio && (
                <p className="mb-4 text-muted-foreground">{user.bio}</p>
              )}

              <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>
                    <strong className="text-foreground">{stats?.followers || 0}</strong> Followers
                  </span>
                  <span className="mx-2">·</span>
                  <span>
                    <strong className="text-foreground">{stats?.following || 0}</strong> Following
                  </span>
                </div>
                {user.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {user.skills && user.skills.length > 0 && (
                <div className="mb-4">
                  <h3 className="mb-2 text-sm font-medium">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {user.githubUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" data-testid="link-github">
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </a>
                  </Button>
                )}
                {user.twitterUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={user.twitterUrl} target="_blank" rel="noopener noreferrer" data-testid="link-twitter">
                      <Twitter className="mr-2 h-4 w-4" />
                      Twitter
                    </a>
                  </Button>
                )}
                {user.websiteUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={user.websiteUrl} target="_blank" rel="noopener noreferrer" data-testid="link-website">
                      <Globe className="mr-2 h-4 w-4" />
                      Website
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-bold tracking-tight">Activity</h2>
          <Card className="p-6">
            <p className="text-center text-muted-foreground">No recent activity</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, GitFork, Eye } from "lucide-react";
import { useState } from "react";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  author: {
    name: string;
    username: string;
    avatar?: string;
  };
  technologies: string[];
  stars: number;
  forks: number;
  views: number;
  updatedAt: string;
}

export function ProjectCard({
  name,
  description,
  author,
  technologies,
  stars,
  forks,
  views,
  updatedAt,
}: ProjectCardProps) {
  const [isStarred, setIsStarred] = useState(false);
  const [starCount, setStarCount] = useState(stars);

  const handleStar = () => {
    if (isStarred) {
      setStarCount(starCount - 1);
      setIsStarred(false);
    } else {
      setStarCount(starCount + 1);
      setIsStarred(true);
    }
  };

  return (
    <Card className="p-6 hover-elevate transition-all" data-testid={`card-project-${name.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={author.avatar} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-muted-foreground">@{author.username}</p>
            <h3 className="text-xl font-bold">{name}</h3>
          </div>
        </div>
      </div>

      <p className="mb-4 text-muted-foreground">{description}</p>

      <div className="mb-4 flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <Badge key={tech} variant="secondary" className="text-xs" data-testid={`badge-tech-${tech}`}>
            {tech}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{views}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="h-4 w-4" />
            <span>{forks}</span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className={`gap-2 ${isStarred ? "text-accent" : ""}`}
          onClick={handleStar}
          data-testid="button-star"
        >
          <Star className={`h-4 w-4 ${isStarred ? "fill-current" : ""}`} />
          <span>{starCount}</span>
        </Button>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">Updated {updatedAt}</p>
    </Card>
  );
}

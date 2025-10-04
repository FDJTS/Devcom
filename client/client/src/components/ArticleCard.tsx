import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Bookmark, Clock } from "lucide-react";
import { useState } from "react";

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    username: string;
    avatar?: string;
  };
  coverImage?: string;
  tags: string[];
  likes: number;
  comments: number;
  readTime: string;
  publishedAt: string;
}

export function ArticleCard({
  title,
  excerpt,
  author,
  coverImage,
  tags,
  likes,
  comments,
  readTime,
  publishedAt,
}: ArticleCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
      setIsLiked(false);
    } else {
      setLikeCount(likeCount + 1);
      setIsLiked(true);
    }
  };

  return (
    <Card className="overflow-hidden hover-elevate transition-all" data-testid={`card-article-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      {coverImage && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <div className="h-full w-full bg-gradient-to-br from-primary/20 to-accent/20" />
        </div>
      )}

      <div className="p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs" data-testid={`badge-tag-${tag}`}>
              #{tag}
            </Badge>
          ))}
        </div>

        <h2 className="mb-2 text-2xl font-bold leading-tight tracking-tight">
          {title}
        </h2>

        <p className="mb-4 line-clamp-2 text-muted-foreground">
          {excerpt}
        </p>

        <div className="mb-4 flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={author.avatar} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">{author.name}</p>
            <p className="text-xs text-muted-foreground">{publishedAt}</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{readTime}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t pt-4">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 ${isLiked ? "text-destructive" : ""}`}
            onClick={handleLike}
            data-testid="button-like"
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            <span>{likeCount}</span>
          </Button>

          <Button variant="ghost" size="sm" className="gap-2" data-testid="button-comment">
            <MessageSquare className="h-4 w-4" />
            <span>{comments}</span>
          </Button>

          <Button variant="ghost" size="sm" className="ml-auto" data-testid="button-bookmark">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

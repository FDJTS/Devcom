import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Bookmark, MoreHorizontal } from "lucide-react";
import { useState } from "react";

interface PostCardProps {
  id: string;
  author: {
    name: string;
    username: string;
    avatar?: string;
  };
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  timestamp: string;
}

export function PostCard({ author, content, tags, likes, comments, timestamp }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [isBookmarked, setIsBookmarked] = useState(false);

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
    <Card className="p-6 hover-elevate transition-all" data-testid={`card-post-${author.username}`}>
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={author.avatar} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {author.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{author.name}</h3>
              <p className="text-sm text-muted-foreground">
                @{author.username} · {timestamp}
              </p>
            </div>
            <Button variant="ghost" size="icon" data-testid="button-post-more">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <p className="mb-4 text-foreground leading-relaxed">{content}</p>

          {tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs" data-testid={`badge-tag-${tag}`}>
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-6">
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

            <Button
              variant="ghost"
              size="sm"
              className={`ml-auto ${isBookmarked ? "text-accent" : ""}`}
              onClick={() => setIsBookmarked(!isBookmarked)}
              data-testid="button-bookmark"
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

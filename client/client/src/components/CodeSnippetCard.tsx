import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Copy, Check } from "lucide-react";
import { useState } from "react";

interface CodeSnippetCardProps {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  author: {
    name: string;
    username: string;
    avatar?: string;
  };
  likes: number;
  comments: number;
  timestamp: string;
}

export function CodeSnippetCard({
  title,
  description,
  code,
  language,
  author,
  likes,
  comments,
  timestamp,
}: CodeSnippetCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [copied, setCopied] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
      setIsLiked(false);
    } else {
      setLikeCount(likeCount + 1);
      setIsLiked(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="overflow-hidden hover-elevate transition-all" data-testid={`card-snippet-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="mb-2 text-xl font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Badge variant="secondary" className="text-xs" data-testid={`badge-language-${language}`}>
            {language}
          </Badge>
        </div>

        <div className="relative mb-4">
          <div className="rounded-lg bg-muted p-4">
            <pre className="overflow-x-auto text-sm">
              <code className="font-mono">{code}</code>
            </pre>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={handleCopy}
            data-testid="button-copy"
          >
            {copied ? (
              <Check className="h-4 w-4 text-accent" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex items-center gap-4 border-t pt-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={author.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-medium">{author.name}</p>
              <p className="text-xs text-muted-foreground">{timestamp}</p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-4">
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
          </div>
        </div>
      </div>
    </Card>
  );
}

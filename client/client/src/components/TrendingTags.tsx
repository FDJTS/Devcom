import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

const trendingTags = [
  { name: "react", count: 1234 },
  { name: "typescript", count: 987 },
  { name: "nextjs", count: 856 },
  { name: "tailwindcss", count: 743 },
  { name: "nodejs", count: 621 },
  { name: "webdev", count: 589 },
  { name: "javascript", count: 512 },
  { name: "python", count: 487 },
];

export function TrendingTags() {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-accent" />
        <h3 className="text-lg font-semibold">Trending Tags</h3>
      </div>

      <div className="space-y-3">
        {trendingTags.map((tag) => (
          <button
            key={tag.name}
            className="flex w-full items-center justify-between rounded-lg p-2 hover-elevate transition-colors"
            data-testid={`button-tag-${tag.name}`}
          >
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                #{tag.name}
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">
              {tag.count.toLocaleString()} posts
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}

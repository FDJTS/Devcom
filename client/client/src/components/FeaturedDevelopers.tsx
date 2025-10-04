import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

const featuredDevelopers = [
  { name: "Emma Watson", username: "emmacodes", bio: "Full-stack developer", avatar: "" },
  { name: "James Kim", username: "jamesdev", bio: "UI/UX Engineer", avatar: "" },
  { name: "Sofia Garcia", username: "sofiatech", bio: "Mobile Developer", avatar: "" },
  { name: "Michael Brown", username: "mikebrown", bio: "DevOps Specialist", avatar: "" },
];

export function FeaturedDevelopers() {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Featured Developers</h3>
      </div>

      <div className="space-y-4">
        {featuredDevelopers.map((dev) => (
          <div
            key={dev.username}
            className="flex items-center gap-3"
            data-testid={`developer-${dev.username}`}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={dev.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {dev.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">{dev.name}</p>
              <p className="truncate text-xs text-muted-foreground">@{dev.username}</p>
            </div>
            <Button size="sm" variant="outline" data-testid={`button-follow-${dev.username}`}>
              Follow
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}

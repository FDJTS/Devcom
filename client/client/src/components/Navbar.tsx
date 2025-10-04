import { Link, useLocation } from "wouter";
import { Search, PenSquare, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CreatePostDialog } from "./CreatePostDialog";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut } from "lucide-react";

export function Navbar() {
  const { user, isAuthenticated } = useAuth();

  const { data: unreadCount } = useQuery<{ count: number }>({
    queryKey: ["/api/notifications/unread/count"],
    enabled: isAuthenticated,
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2" data-testid="link-home">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <span className="text-lg font-bold">DC</span>
            </div>
            <span className="hidden text-xl font-bold tracking-tight md:inline-block">
              DevCom
            </span>
          </Link>
          
          {isAuthenticated && (
            <nav className="hidden items-center gap-6 md:flex">
              <Link href="/feed" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-feed">
                Feed
              </Link>
              <Link href="/articles" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-articles">
                Articles
              </Link>
              <Link href="/snippets" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-snippets">
                Snippets
              </Link>
              <Link href="/projects" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-projects">
                Projects
              </Link>
            </nav>
          )}
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          {isAuthenticated && (
            <>
              <div className="relative hidden w-full max-w-md md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search DevCom..."
                  className="w-full pl-9"
                  data-testid="input-search"
                />
              </div>

              <Button variant="ghost" size="icon" data-testid="button-search-mobile" className="md:hidden">
                <Search className="h-5 w-5" />
              </Button>

              <CreatePostDialog />

              <Button variant="ghost" size="icon" data-testid="button-notifications">
                <div className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount && unreadCount.count > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]" variant="destructive">
                      {unreadCount.count}
                    </Badge>
                  )}
                </div>
              </Button>
            </>
          )}

          <ThemeToggle />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-profile">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl || ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.firstName?.[0] || user?.email?.[0] || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href={`/profile/${user?.id}`} className="flex w-full items-center gap-2" data-testid="link-my-profile">
                    <User className="h-4 w-4" />
                    My Profile
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/settings" className="flex w-full items-center gap-2" data-testid="link-settings">
                    <Settings className="h-4 w-4" />
                    Settings
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/api/logout" className="flex w-full items-center gap-2" data-testid="link-logout">
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild data-testid="button-login">
              <a href="/api/login">Sign In</a>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

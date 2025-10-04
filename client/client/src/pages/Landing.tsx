import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { Card } from "@/components/ui/card";
import { Code, Users, Zap, MessageSquare, Share2, Trophy } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      <div className="container mx-auto px-4 py-16 md:px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Everything You Need to Grow as a Developer
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            DevCom combines the best features of developer communities into one powerful platform
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Share Code Snippets</h3>
            <p className="text-muted-foreground">
              Post and discover code snippets with syntax highlighting for 100+ programming languages
            </p>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Build Your Network</h3>
            <p className="text-muted-foreground">
              Connect with developers worldwide, follow experts, and grow your professional network
            </p>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Publish Articles</h3>
            <p className="text-muted-foreground">
              Write in-depth technical articles and tutorials to share your knowledge with the community
            </p>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <MessageSquare className="h-6 w-6 text-accent" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Engage & Discuss</h3>
            <p className="text-muted-foreground">
              Comment, like, and discuss ideas with fellow developers in a supportive community
            </p>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Share2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Showcase Projects</h3>
            <p className="text-muted-foreground">
              Share your projects, get feedback, and discover amazing work from other developers
            </p>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <Trophy className="h-6 w-6 text-accent" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Learn & Grow</h3>
            <p className="text-muted-foreground">
              Access a wealth of knowledge from experienced developers and accelerate your learning
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

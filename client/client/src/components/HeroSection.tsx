import { Button } from "@/components/ui/button";
import { Code2, Users, Rocket } from "lucide-react";
import heroImage from "@assets/generated_images/Developer_collaboration_hero_image_c17295e4.png";

export function HeroSection() {
  return (
    <section className="relative min-h-[600px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Developer collaboration"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      <div className="container relative z-10 mx-auto flex min-h-[600px] flex-col items-center justify-center px-4 text-center md:px-6">
        <h1 className="mb-6 max-w-4xl text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
          Where Developers{" "}
          <span className="text-primary">Connect</span> and{" "}
          <span className="text-accent">Collaborate</span>
        </h1>
        
        <p className="mb-8 max-w-2xl text-lg text-foreground md:text-xl">
          Join the ultimate community for developers. Share knowledge, showcase projects, and grow together with thousands of developers worldwide.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="gap-2" data-testid="button-get-started">
            <Rocket className="h-5 w-5" />
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 border-foreground/20 bg-background/40 backdrop-blur-md"
            data-testid="button-explore"
          >
            Explore Community
          </Button>
        </div>

        <div className="mt-16 grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Code2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Share Code</h3>
            <p className="text-sm text-muted-foreground">
              Post snippets and projects with syntax highlighting
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">Build Community</h3>
            <p className="text-sm text-muted-foreground">
              Connect with developers and collaborate on ideas
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Rocket className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Grow Together</h3>
            <p className="text-sm text-muted-foreground">
              Learn from articles, discussions, and shared experiences
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { X } from "lucide-react";

export default function Settings() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [bio, setBio] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [githubUrl, setGithubUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  useEffect(() => {
    if (user) {
      setBio(user.bio || "");
      setSkills(user.skills || []);
      setGithubUrl(user.githubUrl || "");
      setTwitterUrl(user.twitterUrl || "");
      setWebsiteUrl(user.websiteUrl || "");
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      bio,
      skills,
      githubUrl,
      twitterUrl,
      websiteUrl,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto flex h-[calc(100vh-4rem)] items-center justify-center px-4">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-4xl px-4 py-8 md:px-6">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">Settings</h1>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Account Information</h2>
            <div className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input value={user?.email || ""} disabled />
                <p className="mt-1 text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input value={user?.firstName || ""} disabled />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input value={user?.lastName || ""} disabled />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Profile Settings</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell the community about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="min-h-[100px]"
                  data-testid="textarea-bio"
                />
              </div>

              <div>
                <Label htmlFor="skills">Skills</Label>
                <div className="mb-2 flex gap-2">
                  <Input
                    id="skills"
                    placeholder="Add a skill (e.g., React, Python)"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                    data-testid="input-skill"
                  />
                  <Button type="button" onClick={handleAddSkill} data-testid="button-add-skill">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1"
                        data-testid={`button-remove-skill-${skill}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="github">GitHub URL</Label>
                <Input
                  id="github"
                  type="url"
                  placeholder="https://github.com/username"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  data-testid="input-github"
                />
              </div>

              <div>
                <Label htmlFor="twitter">Twitter URL</Label>
                <Input
                  id="twitter"
                  type="url"
                  placeholder="https://twitter.com/username"
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  data-testid="input-twitter"
                />
              </div>

              <div>
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  data-testid="input-website"
                />
              </div>

              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                data-testid="button-save-settings"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

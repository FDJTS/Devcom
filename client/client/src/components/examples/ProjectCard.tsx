import { ProjectCard } from '../ProjectCard';

export default function ProjectCardExample() {
  return (
    <div className="max-w-md p-4">
      <ProjectCard
        id="1"
        name="TaskFlow Pro"
        description="A modern task management application built with React, TypeScript, and Supabase. Features real-time collaboration and advanced filtering."
        author={{
          name: "Morgan Taylor",
          username: "morgantaylor",
          avatar: ""
        }}
        technologies={["React", "TypeScript", "Supabase", "TailwindCSS"]}
        stars={234}
        forks={45}
        views={1203}
        updatedAt="2 days ago"
      />
    </div>
  );
}

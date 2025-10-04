import { ArticleCard } from '../ArticleCard';

export default function ArticleCardExample() {
  return (
    <div className="max-w-md p-4">
      <ArticleCard
        id="1"
        title="Building Scalable React Applications with TypeScript"
        excerpt="Learn the best practices for structuring large-scale React applications using TypeScript. We'll cover type safety, component patterns, and performance optimization."
        author={{
          name: "Alex Rivera",
          username: "alexdev",
          avatar: ""
        }}
        coverImage="cover"
        tags={["react", "typescript", "architecture"]}
        likes={156}
        comments={24}
        readTime="8 min read"
        publishedAt="3 days ago"
      />
    </div>
  );
}

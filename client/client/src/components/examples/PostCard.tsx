import { PostCard } from '../PostCard';

export default function PostCardExample() {
  return (
    <div className="max-w-2xl p-4">
      <PostCard
        id="1"
        author={{
          name: "Sarah Chen",
          username: "sarahcodes",
          avatar: ""
        }}
        content="Just shipped a new feature using React Server Components! The performance improvements are incredible. Can't wait to share more details in an upcoming article. 🚀"
        tags={["react", "nextjs", "webdev"]}
        likes={42}
        comments={8}
        timestamp="2h ago"
      />
    </div>
  );
}

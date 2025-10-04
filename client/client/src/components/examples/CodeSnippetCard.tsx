import { CodeSnippetCard } from '../CodeSnippetCard';

export default function CodeSnippetCardExample() {
  return (
    <div className="max-w-2xl p-4">
      <CodeSnippetCard
        id="1"
        title="Custom React Hook for Dark Mode"
        description="A simple and reusable hook to handle dark mode in React applications"
        code={`function useDarkMode() {
  const [theme, setTheme] = useState('dark');
  
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) setTheme(stored);
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  return { theme, toggleTheme };
}`}
        language="TypeScript"
        author={{
          name: "Jordan Lee",
          username: "jordanlee",
          avatar: ""
        }}
        likes={89}
        comments={12}
        timestamp="5h ago"
      />
    </div>
  );
}

"use client";
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const isDark = theme === 'dark';
  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="text-xs rounded border border-neutral-700 px-2 py-1 hover:bg-neutral-800 transition"
    >
      {isDark ? 'Light' : 'Dark'} Mode
    </button>
  );
}
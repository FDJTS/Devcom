import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { SignOutButton } from './AuthForms';
import { getCurrentUser } from '../lib/session';
import Link from 'next/link';

export async function SiteHeader() {
  const user = await getCurrentUser();
  return (
    <header className="flex items-center justify-between py-4">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-semibold tracking-tight text-neutral-100">DevCom</Link>
        <nav className="hidden md:flex items-center gap-4 text-sm text-neutral-400">
          <Link href="/" className="hover:text-neutral-200 transition">Feed</Link>
          <Link href="/projects" className="hover:text-neutral-200 transition">Projects</Link>
          <Link href="/snippets" className="hover:text-neutral-200 transition">Snippets</Link>
          <Link href="/articles" className="hover:text-neutral-200 transition">Articles</Link>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {user ? (
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>{user.email}</span>
            <SignOutButton />
          </div>
        ) : (
          <span className="text-xs text-neutral-500">Guest</span>
        )}
      </div>
    </header>
  );
}
"use client";
import React, { useState } from 'react';
import { registerUser } from '@/lib/auth-actions';
import { signIn, signOut } from 'next-auth/react';

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null); setSuccess(false); setLoading(true);
        const form = e.currentTarget;
        const fd = new FormData(form);
        const res = await registerUser(fd);
        if (!res.ok) setError(res.error || 'Failed'); else setSuccess(true);
        setLoading(false);
      }}
      className="space-y-3 bg-neutral-900/40 p-4 rounded border border-neutral-800"
    >
      <h3 className="text-sm font-medium">Create Account</h3>
      <input name="email" type="email" placeholder="email" required className="w-full rounded bg-neutral-800 px-2 py-1 text-sm" />
      <input name="username" type="text" placeholder="username" required className="w-full rounded bg-neutral-800 px-2 py-1 text-sm" />
      <input name="password" type="password" placeholder="password" required className="w-full rounded bg-neutral-800 px-2 py-1 text-sm" />
      <button disabled={loading} className="text-sm bg-neutral-700 hover:bg-neutral-600 rounded px-3 py-1 disabled:opacity-50">{loading ? 'Creating...' : 'Register'}</button>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {success && <p className="text-xs text-green-400">Account created. You can login now.</p>}
    </form>
  );
}

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null); setLoading(true);
        const fd = new FormData(e.currentTarget);
        const email = fd.get('email') as string;
        const password = fd.get('password') as string;
        const res = await signIn('credentials', { email, password, redirect: false });
        if (res && res.error) setError('Invalid credentials');
        setLoading(false);
      }}
      className="space-y-3 bg-neutral-900/40 p-4 rounded border border-neutral-800"
    >
      <h3 className="text-sm font-medium">Login</h3>
      <input name="email" type="email" placeholder="email" required className="w-full rounded bg-neutral-800 px-2 py-1 text-sm" />
      <input name="password" type="password" placeholder="password" required className="w-full rounded bg-neutral-800 px-2 py-1 text-sm" />
      <button disabled={loading} className="text-sm bg-neutral-700 hover:bg-neutral-600 rounded px-3 py-1 disabled:opacity-50">{loading ? 'Logging in...' : 'Login'}</button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </form>
  );
}

export function SignOutButton() {
  return (
    <button onClick={() => signOut()} className="text-xs text-neutral-400 hover:text-neutral-200">Sign out</button>
  );
}
"use client";
import { useState } from 'react';
import { createPost } from '@/lib/post-actions';

export function PostCompose() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null); setSuccess(false); setPending(true);
        const fd = new FormData(e.currentTarget);
        const res = await createPost(fd);
        if (!res.ok) setError(res.error || 'Failed');
        else { setSuccess(true); e.currentTarget.reset(); }
        setPending(false);
      }}
      className="card space-y-2"
    >
      <div className="flex gap-2 text-xs">
        <label className="sr-only" htmlFor="post-type">Post Type</label>
        <select id="post-type" name="type" aria-label="Post type" className="bg-neutral-800 rounded px-2 py-1 border border-neutral-700">
          <option value="STATUS">Status</option>
          <option value="ARTICLE">Article</option>
          <option value="SNIPPET">Snippet</option>
          <option value="PROJECT">Project</option>
        </select>
        <input name="title" placeholder="Title (for non-status posts)" className="flex-1 bg-neutral-800 rounded px-2 py-1 border border-neutral-700" />
        <input name="tags" placeholder="tags (comma separated)" className="bg-neutral-800 rounded px-2 py-1 border border-neutral-700" />
      </div>
      <textarea name="content" required placeholder="Share something..." className="w-full h-28 bg-neutral-800 rounded px-2 py-1 border border-neutral-700 text-sm" />
      <div className="flex items-center gap-2">
        <button disabled={pending} className="btn-primary btn disabled:opacity-50">{pending ? 'Posting...' : 'Post'}</button>
        {error && <span className="text-xs text-red-400">{error}</span>}
        {success && <span className="text-xs text-green-400">Posted!</span>}
      </div>
    </form>
  );
}
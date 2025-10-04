"use client";
import { useTransition } from 'react';
import { createComment } from '@/lib/comment-actions';

interface Props {
  postId: string;
  parentId?: string | null;
  onDone?: () => void;
}

export function CommentForm({ postId, parentId = null, onDone }: Props) {
  const [pending, start] = useTransition();
  return (
    <form
      className="space-y-2"
      action={(formData) => {
        const content = formData.get('content') as string;
        start(async () => {
          if (!content.trim()) return;
            await createComment({ postId, content, parentId });
            onDone?.();
        });
      }}
    >
      <textarea
        name="content"
        required
        maxLength={4000}
        placeholder={parentId ? 'Reply…' : 'Add a comment…'}
        className="w-full rounded border border-neutral-700 bg-neutral-900 p-2 text-sm resize-y min-h-[80px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
        disabled={pending}
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="px-3 py-1 text-xs rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
        >
          {pending ? 'Posting…' : 'Post'}
        </button>
      </div>
    </form>
  );
}

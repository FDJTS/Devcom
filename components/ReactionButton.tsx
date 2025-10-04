"use client";
import { useOptimistic, useTransition } from 'react';
import { toggleReaction } from '@/lib/reaction-actions';

interface Props {
  postId: string;
  initialCount: number;
  initiallyReacted: boolean;
  type?: string;
}

export function ReactionButton({ postId, initialCount, initiallyReacted, type = 'LIKE' }: Props) {
  const [optimistic, apply] = useOptimistic({ count: initialCount, reacted: initiallyReacted }, (state, action: { reacted: boolean }) => {
    const delta = action.reacted ? 1 : -1;
    return { count: Math.max(0, state.count + delta), reacted: action.reacted };
  });
  const [pending, start] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        start(async () => {
          const next = !optimistic.reacted;
            apply({ reacted: next });
            await toggleReaction(postId, type);
        });
      }}
      className={`text-xs rounded px-2 py-1 border transition ${optimistic.reacted ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-300'}`}
      aria-pressed={optimistic.reacted}
    >
      {optimistic.reacted ? 'Liked' : 'Like'} • {optimistic.count}
    </button>
  );
}
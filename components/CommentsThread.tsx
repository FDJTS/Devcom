"use client";
import { useState } from 'react';
import type { CommentNode } from '@/lib/comments';
import { CommentForm } from '@/components/CommentForm';

interface ThreadProps {
  comments: CommentNode[];
  postId: string;
  depth?: number;
}

export function CommentsThread({ comments, postId, depth = 0 }: ThreadProps) {
  return (
    <ul className={depth === 0 ? 'space-y-4' : 'space-y-3'}>
      {comments.map(c => (
        <li key={c.id} className="space-y-2">
          <CommentItem comment={c} postId={postId} depth={depth} />
        </li>
      ))}
    </ul>
  );
}

function CommentItem({ comment, postId, depth }: { comment: CommentNode; postId: string; depth: number }) {
  const [replying, setReplying] = useState(false);
  return (
    <div className="rounded border border-neutral-800 bg-neutral-900/60 p-3 text-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-neutral-400">{comment.author.profile?.displayName || comment.author.profile?.username || comment.author.email || 'User'}</span>
        <button
          onClick={() => setReplying(v => !v)}
          className="text-[10px] uppercase tracking-wide text-indigo-400 hover:text-indigo-300"
        >
          {replying ? 'Cancel' : 'Reply'}
        </button>
      </div>
      <div className="whitespace-pre-wrap leading-relaxed">{comment.content}</div>
      {replying && (
        <div className="mt-2">
          <CommentForm postId={postId} parentId={comment.id} onDone={() => setReplying(false)} />
        </div>
      )}
      {comment.children.length > 0 && (
        <div className="mt-3 pl-4 border-l border-neutral-800">
          <CommentsThread comments={comment.children} postId={postId} depth={depth + 1} />
        </div>
      )}
    </div>
  );
}

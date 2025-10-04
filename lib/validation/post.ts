import { z } from 'zod';

export const postTypeEnum = z.enum(['ARTICLE','SNIPPET','PROJECT','STATUS']);

export const createPostSchema = z.object({
  type: postTypeEnum.default('STATUS'),
  title: z.string().min(3).max(120).optional().or(z.literal('')),
  content: z.string().min(1).max(20000),
  language: z.string().max(32).optional(),
  tagsCsv: z.string().max(200).optional() // comma separated tag names
}).refine(data => {
  if (['ARTICLE','SNIPPET','PROJECT'].includes(data.type) && !data.title) return false;
  return true;
}, { message: 'Title required for this post type', path: ['title'] });

export type CreatePostInput = z.infer<typeof createPostSchema>;

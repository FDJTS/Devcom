"use server";
import { prisma } from './prisma.js';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_]+$/)
});

export async function registerUser(formData: FormData) {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
    username: formData.get('username')
  };
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: 'Invalid input' };
  }
  const { email, password, username } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { ok: false, error: 'Email already registered' };
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      profile: { create: { username, displayName: username } }
    }
  });
  revalidatePath('/');
  return { ok: true, userId: user.id };
}

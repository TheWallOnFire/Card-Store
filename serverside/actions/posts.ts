'use server';

import { z } from 'zod';
import { createClient } from '../lib/supabase';
import { logServerError } from '../lib/error-logger';
import { checkAdmin } from '../lib/auth-helpers';
import { revalidatePath } from 'next/cache';

const PostSchema = z.object({
  title: z.string().min(5).max(100),
  excerpt: z.string().min(10).max(300).optional(),
  content: z.string().min(50),
  category: z.enum(['blog', 'strategy', 'news']).default('blog'),
  related_game_id: z.string().optional(),
});

export type PostResult = {
  success: boolean;
  message: string;
  postId?: string;
};

/**
 * Server Action: Validates, generates slug, and persists a blog/strategy post.
 * Requires Admin privileges.
 */
export async function publishPostAction(
  _prevState: PostResult | null,
  formData: FormData
): Promise<PostResult> {
  // 1. RBAC Check
  const { isAdmin, userId } = await checkAdmin();
  if (!isAdmin || !userId) {
    return { success: false, message: 'Forbidden: Admin access required to publish.' };
  }

  // 2. Validation
  const validatedFields = PostSchema.safeParse({
    title: formData.get('title'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    category: formData.get('category'),
    related_game_id: formData.get('related_game_id'),
  });

  if (!validatedFields.success) {
    return { success: false, message: "Validation Error", errors: validatedFields.error.flatten() } as any;
  }

  const { title, excerpt, content, category, related_game_id } = validatedFields.data;

  // 3. Slug Generation
  const slug = generateSlug(title);

  // 4. Persistence
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        author_id: userId,
        title,
        slug,
        content, // Expecting Markdown
        category,
        related_game_id,
        status: 'published' // Default to published for simplicity
      })
      .select('id')
      .single();

    if (error) {
       const errorMessage = logServerError(error, 'publishPostAction');
       return { success: false, message: errorMessage };
    }

    revalidatePath('/blog');
    return { success: true, message: 'Strategic insight published successfully.', postId: data.id };

  } catch (err) {
    const errorMessage = logServerError(err, 'publishPostAction_Exception');
    return { success: false, message: errorMessage };
  }
}

/**
 * Simple slug generator for titles.
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-') + '-' + Math.random().toString(36).substring(2, 7);
}

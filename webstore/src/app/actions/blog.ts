'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const blogPostSchema = z.object({
  title: z.string().min(5).max(100),
  excerpt: z.string().min(10).max(300),
  content: z.string().min(50),
  author_id: z.string().uuid(),
  category: z.string().optional(),
  featured_image: z.string().url().optional(),
});

export type BlogPostResult = {
  success: boolean;
  message: string;
  postId?: string;
  errors?: string[];
};

export async function createBlogPostAction(
  _prevState: BlogPostResult | null,
  formData: FormData
): Promise<BlogPostResult> {
  // 1. Validation
  const validatedFields = blogPostSchema.safeParse({
    title: formData.get('title'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    author_id: formData.get('author_id'),
    category: formData.get('category'),
    featured_image: formData.get('featured_image'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation Error",
      errors: validatedFields.error.issues.map(i => i.message),
    };
  }

  const { title, excerpt, content, author_id, category, featured_image } = validatedFields.data;

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('posts')
      .insert({
        title,
        excerpt,
        content,
        author_id,
        category: category || 'General',
        featured_image,
        status: 'published'
      })
      .select('id')
      .single();

    if (error) {
        console.error('Post insertion error:', error);
        return { success: false, message: "Database connection failed. Please try again." };
    }

    revalidatePath('/blog');
    return { success: true, message: "Post conceptualized and published.", postId: data.id };

  } catch (err) {
    console.error('Unexpected blog error:', err);
    return { success: false, message: "An unexpected error occurred." };
  }
}

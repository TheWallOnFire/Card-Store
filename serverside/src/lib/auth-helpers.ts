import { createClient } from './supabase';
import { Database } from './database.types';

export type UserRole = 'user' | 'admin';

/**
 * RBAC Helper: Checks if the current user has the 'admin' role.
 */
export async function checkAdmin(): Promise<{ isAdmin: boolean; userId?: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { isAdmin: false };
  }

  const { data: profile, error: dbError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (dbError || !profile || profile.role !== 'admin') {
    return { isAdmin: false, userId: user.id };
  }

  return { isAdmin: true, userId: user.id };
}

/**
 * Middleware-like wrapper for guarding server actions with auth and roles.
 */
export async function protectedAction<T>(
  action: (userId: string, supabase: any) => Promise<T>,
  options: { requireAdmin?: boolean } = {}
): Promise<T | { success: false; message: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, message: 'Unauthorized access. Please login.' };
  }

  if (options.requireAdmin) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return { success: false, message: 'Forbidden. Admin privileges required.' };
    }
  }

  return action(user.id, supabase);
}

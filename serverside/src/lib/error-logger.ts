import { PostgrestError } from '@supabase/supabase-js';

/**
 * Centralized server-side error logger.
 */
export const logServerError = (error: PostgrestError | Error | unknown, context: string) => {
  console.error(`[SERVER_ERROR] [${context}]:`, error);

  // Return a generic user-friendly message
  if (isPostgrestError(error)) {
    if (error.code === '23505') {
       return 'A record with this unique value already exists.';
    }
    if (error.code === '23503') {
       return 'A related record was not found.';
    }
  }

  return 'An internal server error occurred. Please try again later.';
};

function isPostgrestError(err: any): err is PostgrestError {
  return err && typeof err.code === 'string' && typeof err.message === 'string';
}

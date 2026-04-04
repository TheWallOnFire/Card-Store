import { PostgrestError } from '@supabase/supabase-js';

/**
 * Centralized server-side error logger.
 * In production, this can be integrated with Sentry or another logging service.
 * It hides sensitive database details (like table names or error codes) from the client
 * while logging them on the server for debugging.
 */
export const logServerError = (error: PostgrestError | Error | unknown, context: string) => {
  console.error(`[SERVER_ERROR] [${context}]:`, error);

  // Return a generic user-friendly message
  if (isPostgrestError(error)) {
    // 23505 is unique violation in Postgres
    if (error.code === '23505') {
       return 'A record with this unique value already exists.';
    }
    // 23503 is foreign key violation
    if (error.code === '23503') {
       return 'A related record was not found.';
    }
  }

  return 'An internal server error occurred. Please try again later.';
};

function isPostgrestError(err: any): err is PostgrestError {
  return err && typeof err.code === 'string' && typeof err.message === 'string';
}

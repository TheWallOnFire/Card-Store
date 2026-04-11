import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createListingAction } from '../app/actions/listings';
import { createClient } from '@/lib/supabase';

// Mock the Supabase client
vi.mock('@/lib/supabase', () => ({
  createClient: vi.fn(),
}));

// Mock Next.js headers/cookies
vi.mock('next/headers', () => ({
  cookies: vi.fn().mockReturnValue({
    get: vi.fn(),
    set: vi.fn(),
  }),
}));

// Mock Next.js cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Server Action: createListingAction', () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase = {
      auth: {
        getUser: vi.fn(),
      },
      from: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn(),
    };
    (createClient as any).mockResolvedValue(mockSupabase);
  });

  it('returns unauthorized if no user is logged in', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });

    const formData = new FormData();
    const result = await createListingAction(null, formData);

    expect(result.success).toBe(false);
    expect(result.message).toContain('Unauthorized');
  });

  it('successfully creates a listing if user is authorized', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ 
      data: { user: { id: '7f8a7e32-5a41-4c6e-8e8e-9e8e9e8e9e8e' } }, 
      error: null 
    });
    mockSupabase.single.mockResolvedValue({ data: { id: 'new-listing-id' }, error: null });

    const formData = new FormData();
    formData.append('card_id', '7f8a7e32-5a41-4c6e-8e8e-9e8e9e8e9e8f');
    formData.append('price', '25.00');
    formData.append('quantity', '3');
    formData.append('condition', 'Near Mint');

    const result = await createListingAction(null, formData);

    expect(result.success).toBe(true);
    expect(result.listingId).toBe('new-listing-id');
  });
});

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Hook to handle offline persistence for data fetched via TanStack Query.
 * Uses AsyncStorage to store/retrieve cached snapshots.
 */
export function useOfflineCache<T>(key: string, fetchFn: () => Promise<T>) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [key],
    queryFn: async () => {
      try {
        const data = await fetchFn();
        // Save to offline storage on successful fetch
        await AsyncStorage.setItem(`offline_cache_${key}`, JSON.stringify(data));
        return data;
      } catch (error) {
        // Fallback to offline storage if network fails
        const cached = await AsyncStorage.getItem(`offline_cache_${key}`);
        if (cached) {
          return JSON.parse(cached) as T;
        }
        throw error;
      }
    },
  });

  return query;
}

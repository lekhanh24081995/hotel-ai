import { useQuery } from '@tanstack/react-query';
import { getChats } from '@/app/lib/services/chat';

export function useChats(userId: string, keys: string[]) {
  return useQuery({
    queryKey: ['chats', userId, ...keys],
    queryFn: () => getChats(userId),
    staleTime: 0,
    refetchOnWindowFocus: false,
    gcTime: 0
  });
}

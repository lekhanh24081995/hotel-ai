'use client';

import { useDashboardContext } from '@/app/context/DashboardContext';
import { Session } from '@/app/lib/types/chat';
import { cn } from '@/app/lib/utils/common';
import ChatSidebarInner from '../ChatSidebarInner';
import { useQuery } from '@tanstack/react-query';
import { getChats } from '@/app/lib/services/chat';

interface Props {
  className?: string;
  session: Session;
}
export default function ChatSidebar({ className, session }: Props) {
  const { isSidebarOpen } = useDashboardContext();
  const { data: chats, isLoading } = useQuery({
    queryKey: ['chats'],
    queryFn: () => getChats(session.user.id)
  });

  return (
    <nav
      className={cn(
        'absolute bottom-0 left-0 top-0 hidden w-[300px] bg-muted/40 pt-16 transition-all md:flex',
        className,
        isSidebarOpen ? 'md:translate-x-0' : 'md:-translate-x-full'
      )}
    >
      <ChatSidebarInner
        key={JSON.stringify(chats)}
        chats={chats || []}
        isLoading={isLoading}
      />
    </nav>
  );
}

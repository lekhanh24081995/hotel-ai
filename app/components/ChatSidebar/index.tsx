'use client';

import { useDashboardContext } from '@/app/context/DashboardContext';
import { Session } from '@/app/lib/types/chat';
import { cn } from '@/app/lib/utils/common';
import ChatSidebarInner from '../ChatSidebarInner';
import { useChats } from '@/app/lib/hooks/use-chats';
import { usePathname } from 'next/navigation';

interface Props {
  className?: string;
  session: Session;
}
export default function ChatSidebar({ className, session }: Props) {
  const { isSidebarOpen } = useDashboardContext();
  const pathname = usePathname();
  const { data: chats, isLoading } = useChats(session.user.id, [pathname]);

  return (
    <nav
      className={cn(
        'absolute bottom-0 left-0 top-0 hidden w-[300px] bg-muted/40 pt-16 transition-all md:flex',
        className,
        isSidebarOpen ? 'md:translate-x-0' : 'md:-translate-x-full'
      )}
    >
      <ChatSidebarInner chats={chats || []} isLoading={isLoading} />
    </nav>
  );
}

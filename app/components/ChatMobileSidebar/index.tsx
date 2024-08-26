'use client';

import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import ChatSidebarInner from '../ChatSidebarInner';
import { useDashboardContext } from '@/app/context/DashboardContext';
import { Session } from '@/app/lib/types/chat';
import { useQuery } from '@tanstack/react-query';
import { getChats } from '@/app/lib/services/chat';
interface Props {
  children?: React.ReactNode;
  session: Session;
}
export default function ChatMobileSidebar({ children, session }: Props) {
  const { isMobileSidebarOpen, toggleMobileSidebar } = useDashboardContext();
  const { data: chats, isLoading } = useQuery({
    queryKey: ['chats'],
    queryFn: () => getChats(session.user.id)
  });

  return (
    <Sheet open={isMobileSidebarOpen} onOpenChange={toggleMobileSidebar}>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent
        side="left"
        className="inset-y-0 flex h-auto w-[300px] flex-col bg-background p-0"
      >
        <ChatSidebarInner chats={chats || []} isLoading={isLoading} />
      </SheetContent>
    </Sheet>
  );
}

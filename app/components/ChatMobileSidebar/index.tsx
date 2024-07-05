'use client';

import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import ChatSidebarInner from '../ChatSidebarInner';
import { useDashboardContext } from '@/app/context/DashboardContext';
import { Session } from '@/app/lib/types/chat';
import { usePathname } from 'next/navigation';
import { useChats } from '@/app/lib/hooks/use-chats';
interface Props {
  children?: React.ReactNode;
  session: Session;
}
export default function ChatMobileSidebar({ children, session }: Props) {
  const { isMobileSidebarOpen, toggleMobileSidebar } = useDashboardContext();
  const pathname = usePathname();
  const { data: chats, isLoading } = useChats(session.user.id, [pathname]);

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

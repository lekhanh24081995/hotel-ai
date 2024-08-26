import React from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { PencilSquareIcon, UserIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/button';
import Link from 'next/link';
import { LIST_ROUTER } from '@/app/lib/constants/common';
import ChatSidebarList from '../ChatSidebarList';
import { Chat } from '@/app/lib/types/chat';
import { useDashboardContext } from '@/app/context/DashboardContext';

type Props = {
  chats: Chat[];
  isLoading: boolean;
};
export default function ChatSidebarInner({ chats, isLoading }: Props) {
  const { toggleMobileSidebar } = useDashboardContext();
  return (
    <div className="flex h-full w-full max-w-[unset] flex-col border-none px-4 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="relative h-8 w-8 border bg-gray-800 text-white">
            <AvatarFallback className="bg-gray-800 p-2 text-white">
              <UserIcon />
            </AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium">Chat History</div>
        </div>
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <>
            <Link
              href={LIST_ROUTER.CHATBOT}
              onClick={toggleMobileSidebar}
              className="flex md:hidden"
            >
              <PencilSquareIcon className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
            <Link href={LIST_ROUTER.CHATBOT} className="hidden md:flex">
              <PencilSquareIcon className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </>
        </Button>
      </div>
      <div className="mt-4 flex-1 overflow-auto transition-all">
        {isLoading ? (
          <div className="flex flex-1 flex-col space-y-4 px-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-6 w-full shrink-0 animate-pulse rounded-lg bg-zinc-200"
              />
            ))}
          </div>
        ) : (
          <ChatSidebarList chats={chats} />
        )}
      </div>
    </div>
  );
}

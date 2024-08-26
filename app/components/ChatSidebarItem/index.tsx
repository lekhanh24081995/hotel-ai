'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  ChatBubbleBottomCenterTextIcon,
  EllipsisHorizontalIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import { Chat } from '@/app/lib/types/chat';
import { useDashboardContext } from '@/app/context/DashboardContext';
import { LIST_ROUTER } from '@/app/lib/constants/common';
import { cn } from '@/app/lib/utils/common';
import { Badge } from '../ui/badge';
import { useLocalStorage } from '@/app/lib/hooks/use-local-storage';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import ChatSidebarActionsMenu from '../ChatSidebarActionsMenu';
import { ChatShareDialog } from '../ChatShareDialog';
import { ChatDeleteDialog } from '../ChatDeleteDiaglog';

type Props = {
  chat: Chat;
  index: number;
  isSearchList: boolean;
};
export default function ChatSidebarItem({ chat, isSearchList }: Props) {
  const { toggleMobileSidebar } = useDashboardContext();
  const pathname = usePathname();
  const isActive = chat.path === pathname;
  const [newChatId] = useLocalStorage('newChatId', null);
  const shouldAnimate = isActive && newChatId;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);

  const handleAction = (item: MenuItem) => {
    if (item.title === 'Delete chat') {
      setDeleteDialogOpen(!deleteDialogOpen);
    } else if (item.title === 'Share chat') {
      setShareDialogOpen(!shareDialogOpen);
    }
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <motion.div
      className="relative h-10"
      variants={{
        initial: {
          height: 0,
          opacity: 0
        },
        animate: {
          height: 'auto',
          opacity: 1
        }
      }}
      initial={shouldAnimate ? 'initial' : undefined}
      animate={shouldAnimate ? 'animate' : undefined}
      transition={{
        duration: 0.25,
        ease: 'easeIn'
      }}
    >
      <div
        className={cn(
          'group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted',
          {
            'bg-muted': isActive
          }
        )}
      >
        <Link
          href={`${LIST_ROUTER.CHAT}/${chat.id}`}
          className="flex flex-1 items-center gap-2 truncate md:hidden"
          title={chat.title}
          onClick={toggleMobileSidebar}
        >
          <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
          {!isSearchList && newChatId === chat.id && (
            <Badge className="relative px-2 py-1 text-xs">New</Badge>
          )}
          <div className="truncate font-semibold">
            {shouldAnimate ? (
              chat.title.split('').map((character, index) => (
                <motion.span
                  key={index}
                  variants={{
                    initial: {
                      opacity: 0,
                      x: -100
                    },
                    animate: {
                      opacity: 1,
                      x: 0
                    }
                  }}
                  initial={shouldAnimate ? 'initial' : undefined}
                  animate={shouldAnimate ? 'animate' : undefined}
                  transition={{
                    duration: 0.25,
                    ease: 'easeIn',
                    delay: index * 0.05,
                    staggerChildren: 0.05
                  }}
                >
                  {character}
                </motion.span>
              ))
            ) : (
              <span>{chat.title}</span>
            )}
          </div>
        </Link>
        <Link
          href={`${LIST_ROUTER.CHAT}/${chat.id}`}
          className="hidden flex-1 items-center gap-2 truncate md:flex"
          title={chat.title}
        >
          <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
          {!isSearchList && newChatId === chat.id && (
            <Badge className="relative px-2 py-1 text-xs">New</Badge>
          )}
          <div className="truncate font-semibold">
            {shouldAnimate ? (
              chat.title.split('').map((character, index) => (
                <motion.span
                  key={index}
                  variants={{
                    initial: {
                      opacity: 0,
                      x: -100
                    },
                    animate: {
                      opacity: 1,
                      x: 0
                    }
                  }}
                  initial={shouldAnimate ? 'initial' : undefined}
                  animate={shouldAnimate ? 'animate' : undefined}
                  transition={{
                    duration: 0.25,
                    ease: 'easeIn',
                    delay: index * 0.05,
                    staggerChildren: 0.05
                  }}
                >
                  {character}
                </motion.span>
              ))
            ) : (
              <span>{chat.title}</span>
            )}
          </div>
        </Link>
        {!isSearchList && (
          <ChatSidebarActionsMenu
            onAction={handleAction}
            open={isMenuOpen}
            onOpenChange={setIsMenuOpen}
          >
            <div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <EllipsisVerticalIcon className="relative h-6 w-6 cursor-pointer rounded-full bg-transparent transition-all hover:text-primary md:opacity-0 md:group-hover:opacity-100" />
                </TooltipTrigger>
                <TooltipContent>Options</TooltipContent>
              </Tooltip>
            </div>
          </ChatSidebarActionsMenu>
        )}

        <ChatShareDialog
          chat={chat}
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          onCopy={() => setShareDialogOpen(false)}
        />
        <ChatDeleteDialog
          chat={chat}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onCancel={() => setDeleteDialogOpen(false)}
        />
      </div>
    </motion.div>
  );
}

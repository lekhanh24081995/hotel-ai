'use client';

import Link from 'next/link';
import React from 'react';

import { usePathname } from 'next/navigation';
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { Chat } from '@/app/lib/types/chat';
import { useDashboardContext } from '@/app/context/DashboardContext';
import { LIST_ROUTER } from '@/app/lib/constants/common';
import { cn } from '@/app/lib/utils/common';
import { Badge } from '../ui/badge';
import { useLocalStorage } from '@/app/lib/hooks/use-local-storage';
import { motion } from 'framer-motion';

type Props = {
  chat: Chat;
  index: number;
};
export default function ChatSidebarItem({ chat }: Props) {
  const { toggleSidebar, toggleMobileSidebar } = useDashboardContext();
  const pathname = usePathname();
  const isActive = chat.path === pathname;
  const [newChatId] = useLocalStorage('newChatId', null);
  const shouldAnimate = isActive && newChatId;
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
      <Link
        href={`${LIST_ROUTER.CHAT}/${chat.id}`}
        className={cn(
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted md:hidden',
          {
            'bg-muted': isActive
          }
        )}
        onClick={() => {
          toggleSidebar();
          toggleMobileSidebar();
        }}
      >
        <div
          className="flex flex-1 items-center gap-2 truncate"
          title={chat.title}
        >
          <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
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
        </div>
        {newChatId === chat.id && (
          <Badge
            variant="secondary"
            className="relative -top-2 px-2 py-1 text-xs"
          >
            New
          </Badge>
        )}
      </Link>
      <Link
        href={`${LIST_ROUTER.CHAT}/${chat.id}`}
        className={cn(
          'hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted md:flex',
          {
            'bg-muted': isActive
          }
        )}
      >
        <div
          className="flex flex-1 items-center gap-2 truncate"
          title={chat.title}
        >
          <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
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
        </div>
        {newChatId === chat.id && (
          <Badge
            variant="secondary"
            className="relative bg-muted-foreground px-2 py-1 text-xs text-white"
          >
            New
          </Badge>
        )}
      </Link>
    </motion.div>
  );
}

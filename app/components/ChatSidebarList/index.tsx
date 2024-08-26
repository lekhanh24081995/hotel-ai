import { Chat } from '@/app/lib/types/chat';
import React from 'react';
import ChatSidebarItem from '../ChatSidebarItem';
import { AnimatePresence, motion } from 'framer-motion';

type Props = {
  chats: Chat[];
  isSearchList?: boolean;
};

export default function ChatSidebarList({
  chats,
  isSearchList = false
}: Props) {
  return (
    <AnimatePresence>
      <div className="mr-2 grid gap-2 overflow-y-auto pb-6">
        {chats.length ? (
          chats.map((chat, index) => {
            return (
              <motion.div
                key={chat?.id}
                exit={{
                  opacity: 0,
                  height: 0
                }}
              >
                <ChatSidebarItem
                  chat={chat}
                  key={chat.id + index}
                  index={index}
                  isSearchList={isSearchList}
                />
              </motion.div>
            );
          })
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No chat history</p>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}

import * as React from 'react';
import { type DialogProps } from '@radix-ui/react-dialog';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/app/components/ui/dialog';
import { Input } from '../ui/input';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useDebounce } from 'use-debounce';
import { useQuery } from '@tanstack/react-query';
import { searchChat } from '@/app/lib/services/chat';
import ChatSidebarList from '../ChatSidebarList';

interface ChatSearchDialog extends DialogProps {
  id: string;
}
interface FormData {
  query: string;
}

export function ChatSearchDialog({ id, ...props }: ChatSearchDialog) {
  const { control } = useForm<FormData>({
    defaultValues: {
      query: ''
    }
  });
  const query = useWatch({
    control,
    name: 'query'
  });
  const [debounceQuery] = useDebounce(query, 300);
  const { data: chats } = useQuery({
    queryKey: ['chats', debounceQuery],
    queryFn: async () => {
      const chats = await searchChat(debounceQuery);
      return chats.filter((chat) => chat.id !== id);
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
    gcTime: 0,
    enabled: !!debounceQuery
  });
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search chat</DialogTitle>
          <DialogDescription>
            Enter a keyword or phrase to search through your chat history.
          </DialogDescription>
        </DialogHeader>

        <Controller
          control={control}
          name="query"
          render={({ field: { value, onChange } }) => (
            <Input
              value={value}
              onChange={onChange}
              placeholder="Search chat"
              autoFocus
            />
          )}
        />

        {chats && !!chats.length && (
          <div className="max-h-[350px] overflow-auto scrollbar-hide md:hover:scrollbar-default">
            <ChatSidebarList
              chats={chats}
              isSearchList={true}
              shouldToggleSidebar={false}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import ChatContent from '@/app/components/ChatContent';
import ChatForm from '@/app/components/ChatForm';
import ChatHeader from '@/app/components/ChatHeader';
import { useActions, useAIState, useUIState } from 'ai/rsc';
import { useLocalStorage } from '@/app/lib/hooks/use-local-storage';
import { Message, Session } from '@/app/lib/types/chat';
import { usePathname, useRouter } from 'next/navigation';
import { AI } from '@/app/lib/chat/actions';
import { nanoid } from '@/app/lib/utils';
import { UserMessage } from '../message';
import ButtonScrollToBottom from '../ButtonScrollToBottom';
import { useScrollAnchor } from '@/app/lib/hooks/use-scroll-anchor';
import { LIST_ROUTER } from '@/app/lib/constants/common';
import { cn } from '@/app/lib/utils/common';
import { useDashboardContext } from '@/app/context/DashboardContext';
import { toast } from 'react-toastify';
import ExampleMessages from '../ExampleMessages';

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[];
  id: string;
  session?: Session;
  title?: string;
}

type FormData = {
  message: string;
};
export default function Chat({ id, session, title }: ChatProps) {
  const router = useRouter();
  const path = usePathname();
  const [messages, setMessages] = useUIState<typeof AI>();
  const [aiState] = useAIState();
  const [_, setNewChatId] = useLocalStorage('newChatId', id);
  const { submitUserMessage } = useActions();

  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      message: ''
    }
  });

  const { isSidebarOpen } = useDashboardContext();
  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [scrollRef]);

  useEffect(() => {
    window.addEventListener('scroll-to-bottom', () => {
      scrollToBottom();
    });

    return () => {
      window.removeEventListener('scroll-to-bottom', () => {
        scrollToBottom();
      });
    };
  }, [
    aiState?.messages?.length,
    scrollToBottom,
    messagesRef,
    messages?.length
  ]);

  useEffect(() => {
    if (session?.user) {
      if (path.includes('chatbot') && messages.length >= 1) {
        window.history.replaceState({}, '', `${LIST_ROUTER.CHAT}/${id}`);
      }
    }
  }, [id, path, session?.user, messages, router]);

  useEffect(() => {
    const messagesLength = aiState?.messages?.length;
    if (!refresh && messagesLength >= 2) {
      setRefresh(true);
      router.refresh();
    }
  }, [router, refresh, aiState?.messages?.length]);

  useEffect(() => {
    setNewChatId(id);
  });

  const handleSendMessage = async (message: string) => {
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: nanoid(),
        display: <UserMessage>{message}</UserMessage>
      }
    ]);

    try {
      const responseMessage = await submitUserMessage(message);
      setMessages((currentMessages) => [...currentMessages, responseMessage]);

      scrollToBottom();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onSubmit = async (data: { message: string }) => {
    reset();

    handleSendMessage(data.message);
  };

  return (
    <div
      className={cn(
        'flex flex-1 flex-col',
        isSidebarOpen ? 'md:pl-[300px]' : 'md:pl-0'
      )}
    >
      <ChatHeader id={id} title={title} />

      <div
        className="relative flex-1 overflow-y-auto p-4 md:p-6"
        ref={scrollRef}
      >
        <div ref={messagesRef} className="mx-auto max-w-[1440px]">
          <ChatContent messages={messages} session={session} />
        </div>

        <ButtonScrollToBottom
          isAtBottom={isAtBottom}
          scrollToBottom={scrollToBottom}
        />

        <div className="h-px w-full" ref={visibilityRef} />
      </div>

      <ExampleMessages
        show={!messages.length}
        onSendMessage={handleSendMessage}
      />

      <ChatForm onSubmit={handleSubmit(onSubmit)} control={control} />
    </div>
  );
}

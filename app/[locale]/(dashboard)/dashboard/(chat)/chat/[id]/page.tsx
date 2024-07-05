import Chat from '@/app/components/Chat';
import { AI } from '@/app/lib/chat/actions';
import { LIST_ROUTER } from '@/app/lib/constants/common';
import { getChat } from '@/app/lib/services/chat';
import { Session } from '@/app/lib/types/chat';
import { auth } from '@/auth';
import { type Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

export interface ChatPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const session = await auth();

  if (!session?.user) {
    return {};
  }

  const chat = await getChat(params.id, session.user.id);
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  };
}

export const maxDuration = 60;

export default async function ChatPage({ params }: ChatPageProps) {
  const session = (await auth()) as Session;

  if (!session?.user) {
    redirect(
      `${LIST_ROUTER.LOGIN}?callbackUrl=${LIST_ROUTER.CHAT}/${params.id}`
    );
  }

  const userId = session.user.id;
  const chat = await getChat(params.id, userId);

  if (!chat) {
    redirect(LIST_ROUTER.CHATBOT);
  }

  if (chat.userId !== userId) {
    notFound();
  }

  return (
    <AI
      initialAIState={{
        chatId: chat.id,
        messages: chat.messages,
        interactions: []
      }}
    >
      <Chat
        id={chat.id}
        title={chat.title}
        initialMessages={chat.messages}
        session={session}
      />
    </AI>
  );
}

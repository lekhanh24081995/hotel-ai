import ChatContent from '@/app/components/ChatContent';
import { Button } from '@/app/components/ui/button';
import { AI, getUIStateFromAIState, UIState } from '@/app/lib/chat/actions';
import { getSharedChat } from '@/app/lib/services/chat';
import { auth } from '@/auth';
import { formatDate } from 'date-fns';
import { type Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface SharePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params
}: SharePageProps): Promise<Metadata> {
  const chat = await getSharedChat(params.id);

  return {
    title: chat?.title.slice(0, 50) ?? 'Chat'
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const chat = await getSharedChat(params.id);
  const session = await auth();
  if (!chat || !chat.sharePath) {
    notFound();
  }

  const uiState: UIState = getUIStateFromAIState({
    ...chat,
    chatId: chat.id
  });

  return (
    <main>
      <div className="relative mx-auto w-full max-w-5xl space-y-10 px-4 py-6 transition-all md:p-10">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">{chat.title}</h1>
          <div className="text-sm text-muted-foreground">
            {formatDate(chat.createdAt, 'yyyy MMM dd')} · {chat.messages.length}{' '}
            messages
          </div>
        </div>
        <AI>
          <ChatContent messages={uiState} isShared={true} session={session} />
        </AI>
      </div>

      <footer className="sticky bottom-0 left-0 right-0 z-50 bg-white">
        <div className="mx-auto flex max-w-5xl justify-center py-4">
          <Button asChild>
            <Link href="/dashboard/chatbot">Let&apos;s chat</Link>
          </Button>
        </div>
      </footer>
    </main>
  );
}

import Chat from '@/app/components/Chat';
import { AI } from '@/app/lib/chat/actions';
import { Session } from '@/app/lib/types/chat';
import { nanoid } from '@/app/lib/utils';
import { auth } from '@/auth';

export const maxDuration = 60;

export default async function ChatPage() {
  const id = nanoid();
  const session = (await auth()) as Session;
  return (
    <AI initialAIState={{ chatId: id, interactions: [], messages: [] }}>
      <Chat id={id} session={session} />
    </AI>
  );
}

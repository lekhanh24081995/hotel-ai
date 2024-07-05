'use client';

import { UIState } from '@/app/lib/chat/actions';
import { Session } from '@/app/lib/types/chat';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Props {
  messages: UIState;
  session?: Session | null;
  isShared?: boolean;
}

export default function ChatContent({
  messages,
  session,
  isShared = false
}: Props) {
  return messages.length ? (
    <div className="flex flex-col gap-4">
      {!isShared && !session ? (
        <>
          <div className="group relative flex items-start md:-ml-12">
            <div className="flex size-[25px] shrink-0 select-none items-center justify-center rounded-lg border bg-background shadow-sm">
              <ExclamationTriangleIcon />
            </div>
            <div className="ml-5 flex-1 space-y-2 overflow-hidden px-1">
              <p className="leading-normal text-muted-foreground">
                Please{' '}
                <Link href="/login" className="underline underline-offset-4">
                  log in
                </Link>{' '}
                or{' '}
                <Link href="/signup" className="underline underline-offset-4">
                  sign up
                </Link>{' '}
                to save and revisit your chat history!
              </p>
            </div>
          </div>
        </>
      ) : null}

      {messages.map((message) => (
        <div key={message.id}>
          {message.spinner}
          {message.display}
          {message.attachments}
        </div>
      ))}
    </div>
  ) : null;
}

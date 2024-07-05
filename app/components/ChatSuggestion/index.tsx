'use client';

import { SparklesIcon } from '@heroicons/react/24/outline';
import { useActions, useUIState } from 'ai/rsc';
import React from 'react';

export const suggestions = [
  'Show maps',
  'Show list hotels',
  'Show list restaurants'
];

export default function ChatSuggestion() {
  const { submitUserMessage } = useActions();
  const [_, setMessages] = useUIState();

  return (
    <div className="flex flex-col items-start gap-2 md:flex-row">
      {suggestions.map((suggestion) => (
        <div
          key={suggestion}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-zinc-50 px-3 py-2 text-sm transition-colors hover:bg-zinc-100"
          onClick={async () => {
            const response = await submitUserMessage(suggestion);
            setMessages((currentMessages: any[]) => [
              ...currentMessages,
              response
            ]);
          }}
        >
          <SparklesIcon className="h-6 w-6" />
          {suggestion}
        </div>
      ))}
    </div>
  );
}

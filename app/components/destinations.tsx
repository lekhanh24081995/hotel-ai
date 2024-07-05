'use client';

import { useActions, useUIState } from 'ai/rsc';

export const Destinations = ({ route }: { route: string[] }) => {
  const { submitUserMessage } = useActions();
  const [_, setMessages] = useUIState();

  return (
    <div className="grid gap-4">
      <p>
        Here&apos;s a list of holiday destinations based on our information.
        Choose one to proceed to see more details about hotels, restaurant,
        sight seeings.
      </p>
      <div className="flex flex-col items-start gap-2 sm:flex-row">
        {route.map((city, index) => (
          <button
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-zinc-50 px-3 py-2 text-sm transition-colors hover:bg-zinc-100"
            key={city + index}
            onClick={async () => {
              const response = await submitUserMessage(
                `I would like to see list hotels in ${city}. Proceed to list hotels`
              );
              setMessages((currentMessages: any[]) => [
                ...currentMessages,
                response
              ]);
            }}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};

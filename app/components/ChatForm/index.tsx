import React from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { ArrowUpIcon } from '@heroicons/react/24/outline';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { useEnterSubmit } from '@/app/lib/hooks/use-enter-submit';

interface Props {
  onSubmit: (data: any) => void;
  control: any;
}
export default function ChatForm({ onSubmit, control }: Props) {
  const message = useWatch({
    control,
    name: 'message',
    defaultValue: ''
  });

  const { formRef, onKeyDown } = useEnterSubmit();

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="sticky bottom-0 flex w-full items-center justify-center bg-background md:p-4"
    >
      <div className="relative flex max-h-60 w-full flex-col overflow-hidden md:max-w-2xl">
        <Controller
          control={control}
          name="message"
          render={({ field: { value, onChange } }) => (
            <Textarea
              placeholder="Send a message..."
              name="message"
              id="message"
              className="flex min-h-[60px] resize-none items-center px-4 py-[1.3rem] pr-16 shadow-sm"
              value={value}
              onChange={onChange}
              rows={1}
              tabIndex={0}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              onKeyDown={onKeyDown}
            />
          )}
        />

        <Button
          type="submit"
          size="icon"
          className="absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full"
          disabled={!message}
        >
          <ArrowUpIcon className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
}

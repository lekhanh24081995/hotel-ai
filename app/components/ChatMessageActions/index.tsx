'use client';

import { Button } from '@/app/components/ui/button';
import { IconCheck, IconCopy } from '@/app/components/ui/icons';
import { useCopyToClipboard } from '@/app/lib/hooks/use-copy-to-clipboard';
import { cn } from '@/app/lib/utils';

interface ChatMessageActionsProps extends React.ComponentProps<'div'> {
  message: string;
}

export function ChatMessageActions({
  message,
  className,
  ...props
}: ChatMessageActionsProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

  const onCopy = () => {
    if (isCopied) return;
    copyToClipboard(message);
  };

  return (
    <div className={cn('flex items-center', className)} {...props}>
      <Button variant="ghost" size="icon" onClick={onCopy}>
        {isCopied ? <IconCheck /> : <IconCopy />}
        <span className="sr-only">Copy message</span>
      </Button>
    </div>
  );
}

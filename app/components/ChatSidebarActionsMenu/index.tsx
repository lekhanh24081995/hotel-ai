import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Chat } from '@/app/lib/types/chat';
import { cn } from '@/app/lib/utils/common';
import { IconShare } from '../ui/icons';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/button';

type Props = {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: (item: MenuItem) => void;
};
const items = [
  {
    title: 'Share chat',
    icon: <IconShare className="h-5 w-5" />,
    keyBinding: '⌘S'
  },
  {
    title: 'Delete chat',
    icon: <TrashIcon className="h-5 w-5" />,
    keyBinding: '⌘D'
  }
];

export default function ChatSidebarActionsMenu({
  children,
  open,
  onOpenChange,
  onAction
}: Props) {
  return (
    <DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cn(
            'data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-50 min-w-[180px] rounded-md bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] md:min-w-[220px]'
          )}
          sideOffset={5}
        >
          <div className="space-y-1 px-4 py-2">
            {items.map((item, index) => (
              <DropdownMenu.Item
                key={item.title + index}
                className="group data-[highlighted]:outline-none"
              >
                <Button
                  type="button"
                  variant={'ghost'}
                  className="flex w-full items-center justify-start gap-2 rounded-lg p-0 hover:bg-inherit group-data-[highlighted]:text-red-2 "
                  onClick={() => onAction(item)}
                >
                  {item.icon}
                  {item.title}
                  <kbd className="ml-auto hidden font-sans text-xs text-black/50 group-data-[highlighted]:inline">
                    {item.keyBinding}
                  </kbd>
                </Button>
              </DropdownMenu.Item>
            ))}
          </div>

          <DropdownMenu.Arrow className="fill-white" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

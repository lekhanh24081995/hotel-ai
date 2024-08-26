import * as React from 'react';
import { type DialogProps } from '@radix-ui/react-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/app/components/ui/dialog';
import { Button } from '../ui/button';
import { removeChat } from '@/app/lib/services/chat';
import { Chat } from '@/app/lib/types/chat';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { IconSpinner } from '../ui/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDashboardContext } from '@/app/context/DashboardContext';

interface ChatDeleteDialog extends DialogProps {
  chat: Chat;
  onCancel: () => void;
}

export function ChatDeleteDialog({
  chat,
  onCancel,
  ...props
}: ChatDeleteDialog) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toggleMobileSidebar } = useDashboardContext();
  const deleteChatMutation = useMutation({
    mutationFn: () =>
      removeChat({
        id: chat.id,
        path: chat.path
      }),
    onSuccess: () => {
      onCancel();
      toast.success('Chat deleted', {
        className: 'bg-green-500',
        autoClose: 1000
      });
      toggleMobileSidebar();
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    }
  });

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This will permanently delete your chat message and remove your data
            from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button disabled={deleteChatMutation.isPending} onClick={onCancel}>
            Cancel
          </Button>
          <Button
            disabled={deleteChatMutation.isPending}
            variant={'destructive'}
            onClick={async (event) => {
              event.preventDefault();

              try {
                await deleteChatMutation.mutateAsync();
                router.refresh();
              } catch (error) {
                console.error('Error deleting chat:', error);
              }
            }}
          >
            {deleteChatMutation.isPending && (
              <IconSpinner className="mr-2 animate-spin" />
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

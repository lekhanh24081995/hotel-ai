import React, { useState } from 'react';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Button } from '@/app/components/ui/button';
import { MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';
import { useDashboardContext } from '@/app/context/DashboardContext';
import { IconShare } from '../ui/icons';
import { ChatShareDialog } from '../ChatShareDialog';
import { useAIState } from 'ai/rsc';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { ChatSearchDialog } from '../ChatSearchDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { LIST_AI_MODELS } from '@/app/lib/constants/common';
import { useLocalStorage } from '@/app/lib/hooks/use-local-storage';

type Props = {
  id: string;
  title?: string;
};

export default function ChatHeader({ id, title }: Props) {
  const { isSidebarOpen, toggleSidebar } = useDashboardContext();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [aiState] = useAIState();
  const [model, setModel] = useLocalStorage('model', LIST_AI_MODELS[0]);
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-background px-4 py-4 shadow-md md:px-6">
      <div className="flex items-center gap-2">
        <Avatar className="relative h-8 w-8 border bg-gray-800 text-white">
          <AvatarFallback className="bg-gray-800 p-2 text-white">
            <UserIcon />
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-2 text-sm font-medium">
          <h1>Chatbot</h1>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="gap-1">
              <SelectValue placeholder="Select model">{model}</SelectValue>
            </SelectTrigger>
            <SelectContent position="item-aligned">
              {LIST_AI_MODELS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {aiState?.messages?.length >= 2 && id && title && (
          <>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setShareDialogOpen(!shareDialogOpen)}
                >
                  <IconShare className="h-5 w-5" />
                  <span className="sr-only">Share</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share</TooltipContent>
            </Tooltip>

            <ChatShareDialog
              open={shareDialogOpen}
              onOpenChange={setShareDialogOpen}
              onCopy={() => setShareDialogOpen(false)}
              chat={{
                id,
                title,
                messages: aiState?.messages
              }}
            />
          </>
        )}
        <>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setSearchDialogOpen(!searchDialogOpen)}
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Search</TooltipContent>
          </Tooltip>

          <ChatSearchDialog
            open={searchDialogOpen}
            onOpenChange={setSearchDialogOpen}
            id={id}
          />
        </>

        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hidden rounded-full md:flex"
            >
              <MoveHorizontalIcon className="h-5 w-5" onClick={toggleSidebar} />
              <span className="sr-only">
                {isSidebarOpen ? 'Expand' : 'Collapse'}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isSidebarOpen ? 'Expand' : 'Collapse'}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

function MoveHorizontalIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 8 22 12 18 16" />
      <polyline points="6 8 2 12 6 16" />
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  );
}

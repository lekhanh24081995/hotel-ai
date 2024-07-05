'use client';

import { useDashboardContext } from '@/app/context/DashboardContext';
import { cn } from '@/app/lib/utils/common';
import * as React from 'react';

export interface SidebarProps extends React.ComponentProps<'div'> {}

export function Sidebar({ className, children }: SidebarProps) {
  const { isSidebarOpen, isLoading } = useDashboardContext();

  return (
    <div
      data-state={isSidebarOpen && !isLoading ? 'open' : 'closed'}
      className={cn(className, 'h-full flex-col dark:bg-zinc-950')}
    >
      {children}
    </div>
  );
}

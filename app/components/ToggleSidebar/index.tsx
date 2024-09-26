'use client';

import { useDashboardContext } from '@/app/context/DashboardContext';
import { Bars3Icon } from '@heroicons/react/24/outline';
import React from 'react';

export default function ToggleSidebar() {
  const { toggleMobileSidebar } = useDashboardContext();
  return (
    <span
      className="flex flex-shrink-0 cursor-pointer items-center justify-center text-slate-300"
      onClick={toggleMobileSidebar}
    >
      <Bars3Icon className="h-8 w-8 text-primary md:h-9 md:w-9" />
    </span>
  );
}

'use client';

import { useDashboardContext } from '@/app/context/DashboardContext';
import SidebarList from '../SidebarList';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

type Props = {
  children?: React.ReactNode;
};
export default function MobileSidebar({ children }: Props) {
  const { isMobileSidebarOpen, toggleMobileSidebar } = useDashboardContext();
  return (
    <Sheet open={isMobileSidebarOpen} onOpenChange={toggleMobileSidebar}>
      {children && <SheetTrigger>{children}</SheetTrigger>}
      <SheetContent
        side="left"
        className="inset-y-0 flex h-auto w-[300px] flex-col border-r border-primary bg-primary p-0 text-slate-200"
      >
        <SidebarList />
      </SheetContent>
    </Sheet>
  );
}

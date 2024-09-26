import {
  BellIcon,
  ChevronDownIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import AvatarMenu from '../AvatarMenu';
import Logo from '../Logo';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Suspense } from 'react';
import ToggleSidebar from '../ToggleSidebar';
import { auth } from '@/auth';
import Heading from '../Heading';

async function UserOrLogin() {
  const session = await auth();

  return (
    <>
      {session?.user && (
        <div className="flex items-center gap-4">
          <div className="relative h-7 w-7 md:h-8 md:w-8">
            <BellIcon className="cursor-pointer" />
            <div className="absolute right-0 top-0 h-3 w-3 rounded-full bg-red-1" />
          </div>

          <div className="flex items-stretch gap-4">
            <AvatarMenu user={session.user}>
              <div className="relative">
                <Avatar className="relative h-8 w-8 cursor-pointer bg-red-1 text-white md:h-10 md:w-10">
                  <AvatarImage src={session.user?.image!} />
                  <AvatarFallback className="bg-red-1 p-2 text-white md:p-[10px]">
                    <UserIcon />
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-[-2px] right-[-2px] h-3 w-3 rounded-full bg-gray-200 p-[3px] text-secondary-foreground md:h-[14px] md:w-[14px]">
                  <ChevronDownIcon className="cursor-pointer " />
                </span>
              </div>
            </AvatarMenu>
          </div>
        </div>
      )}
    </>
  );
}

export default function Header() {
  return (
    <header className="header z-1 fixed left-0 right-0 top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 py-[10px] transition-all md:px-6">
      <Heading />

      <div className="flex items-center justify-between gap-4 md:hidden">
        <ToggleSidebar />
        <Logo />
      </div>

      <Suspense fallback={<div className="flex-1 overflow-auto"></div>}>
        <UserOrLogin />
      </Suspense>
    </header>
  );
}

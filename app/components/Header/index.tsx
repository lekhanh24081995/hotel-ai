import {
  BellIcon,
  ChevronDownIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import MyMenu from '../MyMenu';
import Logo from '../Logo';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Suspense } from 'react';
import ToggleSidebar from '../ToggleSidebar';
import { auth } from '@/auth';

async function UserOrLogin() {
  const session = await auth();
  return (
    <>
      {session?.user && (
        <div className="flex items-center">
          <div className="flex items-stretch gap-4">
            <Avatar className="relative h-8 w-8 bg-red-1 text-white md:h-12 md:w-12">
              <AvatarImage src={session.user?.image!} />
              <AvatarFallback className="bg-red-1 p-2 text-white md:p-3">
                <UserIcon />
              </AvatarFallback>
            </Avatar>
            <div className="hidden flex-col justify-between md:flex">
              <h1 className="text-sm font-semibold text-primary">
                {session.user.role === 'admin' ? 'Administrator' : 'User'}
              </h1>
              <div className="flex items-center gap-4">
                <h2 className="font-semibold ">{session.user?.full_name}</h2>
                <MyMenu user={session.user}>
                  <ChevronDownIcon className="h-3 w-3 cursor-pointer" />
                </MyMenu>
              </div>
            </div>
          </div>
          <div className="relative ml-2 h-8 w-8 md:ml-5">
            <BellIcon className="cursor-pointer" />
            <div className="absolute right-0 top-0 h-3 w-3 rounded-full bg-red-1" />
          </div>
        </div>
      )}
    </>
  );
}

export default function Header() {
  return (
    <header className="header z-1 fixed left-0 right-0 top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 py-[10px] transition-all md:left-[68px] md:px-10">
      <h1 className="hidden text-lg font-bold md:block">Dashboard</h1>

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

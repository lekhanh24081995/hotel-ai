import BackButton from '@/app/components/BackButton';
import ChatMobileSidebar from '@/app/components/ChatMobileSidebar';
import ChatSidebar from '@/app/components/ChatSidebar';
import Header from '@/app/components/Header';
import { LIST_ROUTER } from '@/app/lib/constants/common';
import { auth } from '@/auth';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: {
    template: '%s | Hotel AI Dashboard',
    default: 'Hotel AI Dashboard'
  }
};

export default async function Layout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect(`${LIST_ROUTER.LOGIN}`);
  }

  return (
    <main>
      <div className="relative mx-auto w-full bg-gray-200 transition-all">
        <BackButton className="fixed left-0 top-0 z-10 hidden h-16 w-[68px] cursor-pointer border-b bg-white p-6 md:flex" />
        <Header />

        <div className="flex h-screen max-h-screen w-full bg-background pt-16">
          <ChatSidebar session={session} />
          <ChatMobileSidebar session={session} />

          {children}
        </div>
      </div>
    </main>
  );
}

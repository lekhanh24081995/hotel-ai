import Header from '@/app/components/Header';
import MobileSidebar from '@/app/components/MobileSidebar';
import Sidebar from '@/app/components/Sidebar';
import { Metadata } from 'next';

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
  return (
    <main>
      <Sidebar />
      <MobileSidebar />

      <div className="wrap relative mx-auto w-full bg-gray-200 transition-all md:pl-[68px]">
        <Header />
        <div className="pt-16">{children}</div>
      </div>
    </main>
  );
}

import { DashboardProvider } from '@/app/context/DashboardContext';

export const dynamic = 'force-dynamic';

export default async function Layout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return <DashboardProvider>{children}</DashboardProvider>;
}

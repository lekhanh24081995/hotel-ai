import { useDashboardContext } from '@/app/context/DashboardContext';
import { cn } from '@/app/lib/utils/common';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  link: any;
};
export default function SidebarItem({ link }: Props) {
  const pathname = usePathname();
  const { isSidebarOpen } = useDashboardContext();
  return (
    <Link
      className={cn(
        `flex items-center gap-x-2 rounded-md p-2 transition-all hover:bg-slate-300 hover:text-gray-700 md:hover:bg-white`,
        {
          'bg-slate-300 text-gray-700': pathname === link.href
        }
      )}
      href={link.href}
    >
      {link.icon}

      {isSidebarOpen && (
        <span className="hidden leading-5 md:block">{link.title}</span>
      )}
      {<span className="block leading-5 md:hidden">{link.title}</span>}
    </Link>
  );
}

import React from 'react';
import {
  BuildingStorefrontIcon,
  ChartBarIcon,
  CircleStackIcon,
  Cog8ToothIcon,
  DocumentChartBarIcon,
  ListBulletIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';
import SidebarItem from '../SidebarItem';
import { LIST_ROUTER } from '@/app/lib/constants/common';

const links = [
  {
    title: 'Admin',
    href: LIST_ROUTER.DASHBOARD,
    icon: <ChartBarIcon className="h-5 w-5" />
  },
  {
    title: 'Chatbot',
    href: LIST_ROUTER.CHATBOT,
    icon: <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
  },
  {
    title: 'Hotel',
    href: LIST_ROUTER.HOTEL,
    icon: <DocumentChartBarIcon className="h-5 w-5" />
  },
  {
    title: 'Restaurant',
    href: LIST_ROUTER.RESTAURANT,
    icon: <CircleStackIcon className="h-5 w-5" />
  },
  {
    title: 'Destination',
    href: LIST_ROUTER.DESTINATION,
    icon: <BuildingStorefrontIcon className="h-5 w-5" />
  },
  {
    title: 'Tool',
    href: LIST_ROUTER.TOOL,
    icon: <ListBulletIcon className="h-5 w-5" />
  },
  {
    title: 'Settings',
    href: LIST_ROUTER.SETTINGS,
    icon: <Cog8ToothIcon className="h-5 w-5" />
  }
];

export default function SidebarList() {
  return (
    <ul className="flex h-full flex-col gap-4 overflow-y-auto px-4 py-6 text-slate-200">
      {links.map((link, index) => (
        <li key={link.title + index}>
          <SidebarItem link={link} />
        </li>
      ))}
    </ul>
  );
}

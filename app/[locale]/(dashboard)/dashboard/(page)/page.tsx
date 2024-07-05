import Charts from '@/app/components/Charts';
import { Button } from '@/app/components/ui/button';
import {
  CalendarDaysIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

export default async function Dashboard() {
  return (
    <div className="p-4 md:p-10">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Sales Overview</h1>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">
            <CalendarDaysIcon className="mr-3 h-5 w-5" />
            Last 30 days
          </Button>
          <Button variant="outline">
            <ClipboardDocumentListIcon className="mr-3 h-5 w-5" />
            Reports
          </Button>
        </div>
      </div>
      <Charts />
    </div>
  );
}

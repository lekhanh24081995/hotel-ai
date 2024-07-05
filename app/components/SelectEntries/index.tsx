'use client';

import { Card } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/app/components/ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function SelectEntries() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const limit = searchParams.get('limit') || '10';
  const pathname = usePathname();

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('limit', value);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };
  return (
    <Card className="max-w-64 flex-1">
      <div className="grid gap-2 p-4">
        <Label htmlFor="rating">Entries per page</Label>
        <Select defaultValue={limit} onValueChange={handleSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select number">{limit}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}

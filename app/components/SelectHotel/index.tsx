'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/app/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface Props {
  items: Hotel[];
  current: Hotel;
}
const SelectHotel = ({ items, current }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('_id', value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Card className="mb-10 mt-6 max-w-2xl">
      <CardHeader>
        <CardTitle>Select hotel</CardTitle>
      </CardHeader>
      <CardContent>
        <Select
          defaultValue={current?.vietnamese_name}
          onValueChange={handleSelect}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select hotel">
              {current.vietnamese_name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent position="item-aligned">
            {items.map((item) => (
              <SelectItem key={item._id} value={item._id}>
                {item.vietnamese_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default SelectHotel;

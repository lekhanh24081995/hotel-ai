'use client';

import { useEffect } from 'react';
import { Input, InputProps } from '../ui/input';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useDebounce } from 'use-debounce';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface FormData {
  query: string;
}

export default function Search(props: InputProps) {
  const searchParams = useSearchParams();
  const queryParams = searchParams.get('query') || '';
  const router = useRouter();
  const pathname = usePathname();

  const { control } = useForm<FormData>({
    defaultValues: {
      query: queryParams
    }
  });
  const query = useWatch({
    control,
    name: 'query'
  });

  const [debounceQuery] = useDebounce(query, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.delete('page');
      params.set('query', debounceQuery);
    } else {
      params.delete('query');
    }
    router.push(`${pathname}?${params.toString()}`);
  }, [debounceQuery, pathname, query, router, searchParams]);

  return (
    <Controller
      control={control}
      name="query"
      render={({ field: { value, onChange } }) => (
        <Input
          {...props}
          value={value}
          onChange={onChange}
          placeholder="Search"
        />
      )}
    />
  );
}

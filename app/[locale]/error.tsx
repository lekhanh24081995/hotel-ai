'use client';
import { useEffect } from 'react';
import { Button } from '../components/ui/button';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <h2 className="mb-6 text-center text-xl font-semibold md:text-3xl">
        {error.message || 'Something went wrong!'}
      </h2>
      <Button onClick={() => reset()}>Try again</Button>
    </main>
  );
}

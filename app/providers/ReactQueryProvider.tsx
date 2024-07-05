'use client';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';

function handleError(error: any) {
  console.log(error);
}

function ReactQueryProvider({ children }: React.PropsWithChildren) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false
      }
    },
    queryCache: new QueryCache({
      onError: handleError
    }),
    mutationCache: new MutationCache({
      onError: handleError
    })
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default ReactQueryProvider;

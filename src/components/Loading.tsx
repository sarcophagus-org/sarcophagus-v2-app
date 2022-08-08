import { Center, Spinner } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from '../store';

export function Loading({ children }: { children: React.ReactNode }) {
  const isLoading = useSelector(s => s.appState.isLoading);

  if (!isLoading) return <>{children}</>;

  return (
    <Center
      height="100%"
      width="100%"
    >
      <Spinner size="xl" />
    </Center>
  );
}

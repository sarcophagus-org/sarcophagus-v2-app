import { Text, Center, Spinner } from '@chakra-ui/react';

export function BusyIndicator({ children }: { children?: React.ReactNode }) {
  return (
    <Center
      flexDirection="column"
      py="64px"
    >
      <Spinner size="xl" />
      <Text mt={6}>{children}</Text>
    </Center>
  );
}

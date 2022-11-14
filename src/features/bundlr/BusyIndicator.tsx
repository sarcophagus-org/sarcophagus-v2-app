import { Text, Center, Spinner } from '@chakra-ui/react';

export function BusyIndicator({ children }: { children?: React.ReactNode }) {
  return (
    <Center
      flexDirection="column"
      py="64px"
    >
      <Spinner
        color="whiteAlpha.700"
        size="xl"
      />
      <Text
        color="whiteAlpha.800"
        mt={6}
      >
        {children}
      </Text>
    </Center>
  );
}

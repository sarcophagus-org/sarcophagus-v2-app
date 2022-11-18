import { Center, Text } from '@chakra-ui/react';

// TODO: Get with design for a proper 404 page
export function NotFoundPage() {
  return (
    <Center h="10vh">
      <Text
        fontSize="2xl"
        variant="secondary"
      >
        404 NOT FOUND
      </Text>
    </Center>
  );
}

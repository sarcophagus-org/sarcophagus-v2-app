import { Center, Container, Flex, Text } from '@chakra-ui/react';

export function ErrorFallback({ error }: { error: Error }) {
  return (
    <Center
      flexDirection="column"
      height="100vh"
    >
      <Flex direction="column">
        <Text fontSize="5xl">Oops!</Text>
        <Text fontSize="xl">There was an error.</Text>
        <Container
          mt={12}
          minWidth={400}
          borderWidth={1}
          borderColor="tomato"
          borderRadius={5}
          px={2}
          py={4}
        >
          <Text color="tomato">{error.message}</Text>
        </Container>
      </Flex>
    </Center>
  );
}

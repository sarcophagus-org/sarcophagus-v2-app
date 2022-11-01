import { Flex, Text } from '@chakra-ui/react';

export function SummaryErrorIcon({ error }: { error?: string }) {
  return (
    <Flex
      h="1.2rem"
      w="1.2rem"
      borderRadius={100}
      background="errorAlt"
      alignItems="center"
      justifyContent="center"
      onMouseEnter={() => console.log(error)}
    >
      <Text color="red">!</Text>
    </Flex>
  );
}

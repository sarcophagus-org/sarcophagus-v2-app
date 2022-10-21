import { Flex, Text } from '@chakra-ui/react';

export function SummaryErrorIcon() {
  return (
    <Flex
      ml={3}
      h="1.2rem"
      w="1.2rem"
      borderRadius={100}
      background="errorAlt"
      alignItems="center"
      justifyContent="center"
    >
      <Text color="red">!</Text>
    </Flex>
  );
}

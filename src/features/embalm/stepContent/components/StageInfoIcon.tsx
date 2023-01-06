import { Button, Flex } from '@chakra-ui/react';

export function StageInfoIcon() {
  return (
    <Flex
      h="1.2rem"
      w="1.2rem"
      borderRadius={100}
      background="background.green"
      alignItems="center"
      justifyContent="center"
    >
      <Flex
        h="1.2rem"
        w="1.2rem"
        borderRadius={100}
        background="background.green"
        alignItems="center"
        justifyContent="center"
        color="green"
      >
        <Button variant="unstyled">{'>'}</Button>
      </Flex>
    </Flex>
  );
}

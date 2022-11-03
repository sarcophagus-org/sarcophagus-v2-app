import { Button, Flex, Text, Tooltip } from '@chakra-ui/react';

export function SummaryErrorIcon({ error }: { error?: string }) {
  return (
    <Tooltip
      placement='top'
      closeDelay={500}
      label={error}
      isDisabled={!error}
    >
      <Flex
        h="1.2rem"
        w="1.2rem"
        borderRadius={100}
        background="errorAlt"
        alignItems="center"
        justifyContent="center"
      >
        <Flex h="1.2rem" w="1.2rem" borderRadius={100} background="errorAlt" alignItems="center" justifyContent="center" color="red" >
          <Button variant="unstyled">!</Button>
        </Flex>
      </Flex>
    </Tooltip>
  );
}

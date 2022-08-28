import { Flex, Heading } from '@chakra-ui/react';
import { StepContent } from 'features/embalm/stepContent';
import { StepNavigator } from './stepNavigator';

export function Embalm() {
  return (
    <Flex
      mx="84px"
      direction="column"
      height="100%"
    >
      {/* Upper section with title */}
      <Flex py="48px">
        <Heading>New Sarcophagus</Heading>
      </Flex>

      {/* Lower section with content */}
      <Flex
        flex={1}
        direction="row"
        height="100%"
        width="100%"
      >
        {/* Left side container */}
        <Flex w={375}>
          <StepNavigator />
        </Flex>

        {/* Space between */}
        <Flex
          minWidth={100}
          w="10%"
        />

        {/* Right side container */}
        <Flex flex={1}>
          <StepContent />
        </Flex>
      </Flex>
    </Flex>
  );
}

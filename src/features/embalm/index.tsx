import { Flex, Heading } from '@chakra-ui/react';
import { EmbalmContent } from 'features/embalm/embalmContent';
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
        <Flex
          width="30%"
          minWidth={350}
        >
          <StepNavigator />
        </Flex>

        {/* Right side container */}
        <Flex flex={1}>
          <EmbalmContent />
        </Flex>
      </Flex>
    </Flex>
  );
}

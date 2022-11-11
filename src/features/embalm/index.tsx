import { Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { MagicFormFiller } from 'components/MagicFormFiller';
import { StepContent } from 'features/embalm/stepContent';

import { useBootLibp2pNode } from '../../hooks/libp2p/useBootLibp2pNode';
import { useLoadArchaeologists } from './stepContent/hooks/useLoadArchaeologists';
import { StepNavigator } from './stepNavigator';

// Set to true to remove the magic form filler button on the top right
const hideMagicFormFiller = false;

export function Embalm() {
  useLoadArchaeologists();
  useBootLibp2pNode(20_000);

  return (
    <Flex
      ml="84px"
      w="65%"
      minWidth="500px"
      direction="column"
      height="100%"
    >
      {process.env.NODE_ENV === 'development' && !hideMagicFormFiller && <MagicFormFiller />}
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
          minWidth={300}
          maxWidth={300}
        >
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
